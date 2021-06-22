import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Dimensions, Image, ScrollView, Pressable, BackHandler, Linking, Platform } from 'react-native'
import { AntDesign, MaterialCommunityIcons, Ionicons, Entypo, MaterialIcons} from '@expo/vector-icons'; 
import getDistance from 'geolib/es/getDistance';

import {Text, RowView} from 'styles'
import color from 'colors'
import moment from 'moment';
import Loading from 'components/Loading'
import { updateOrder, Message, getDataById, updateProviderProfile } from 'hooks/useData'
import {DataConsumer} from 'context/data'
import { sendPushNotification } from 'middlewares/notification'
import CONSTANT from 'navigation/navigationConstant'
import TimeDiff from 'middlewares/TimeDiff'
import ScreenModal from 'components/ScreenModal'
import messageTemplate from '../../data/messageTemplate';

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const _openMap = ({latitude, longitude}, label)=>{
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
}


const AcceptScreen = ({accept,setNotice, price, data})=>{
    return <ScreenModal>
    <Text regular size={13}>Important!</Text>
    <Pressable style={{position:'absolute', right:0, padding:10}} onPress={()=>setNotice(false)}>
        <Entypo name="cross" size={24} color={color.inActive} />
    </Pressable>
    <Text size={13} regular style={{marginVertical:10}}>
        Once you accept this offer,
        you have to pay <Text regular theme={color.blue}>₹{price}</Text> to {data.name} as a <Text regular theme={color.blue}>Service Charge</Text>{'\n'}
        {/* एक बार जब आप इस प्रस्ताव को स्वीकार कर लेंगे, तो आपको सेवा शुल्क के रूप में कविता को ₹150 का भुगतान करना होगा */}
    </Text>
    <Pressable onPress={accept} style={styles.okButton}>
        <Text size={13} bold>I'm Agree</Text>
    </Pressable>
</ScreenModal>
}

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'-30deg'}, {translateY:-100}]}}/>
    </View>
}

const IMAGE_SIZE = 100

const Review=({data={}})=><View style={{...styles.contentContainer, backgroundColor: 'rgba(18, 18, 18,0.8)',padding:5, borderRadius:10}}>
    <RowView>
        <View style={{marginLeft:10}}>
            <Text regular>
                {Math.round(data.rating*1.2*100)/100} <AntDesign name="star" size={15} color={color.active} />
            </Text>
        </View>
    </RowView>
    <View style={{marginHorizontal:10}}>
        <Text regular size={12} style={{width:'100%'}} numberOfLines={2}>{data.review}</Text>
    </View>
    <View style={{position: 'absolute',right: 10,top:10, alignItems:'flex-end'}}>
        <Text size={10}>{TimeDiff(data.postedAt).diff}</Text>
        <Text size={10} regular>{data.subCat}</Text>
    </View>
</View>

const Point = ({children, last=false, text, onPress=()=>{}})=><Pressable onPress={onPress} android_ripple={{color:color.dark}} style={{...styles.Points, borderBottomWidth:last ? 0:2}}>
    <RowView>
        {children}
        <Text size={13} regular>{text}</Text>
    </RowView>
</Pressable> 

const ServiceProfile = ({route, navigation}) => {
    const {data, proposal, orderId, proposalData} = route.params
    const [loading, setLoading] = useState(false)
    const [pro, setPro] = useState('')
    const [orderData, setOrderData] = useState()
    const [rating, setRating] = useState(0)
    const {state} = DataConsumer()
    const [notice, setNotice] = useState(false)
    var result
    if(orderData){
        result =  state.category.find(item=>item.id===data.category).subCategory.find(({id})=>id===orderData.info.subCategory)
    }
    useEffect(() => {
        var rate = 0
        const result = state.category.find(item=>item.id === data.category)
        setPro(result.name)  
        getDataById('order',orderId).then(({data})=>{
            setOrderData(data)
        })
        if(data.rating){
            data.rating.map(item=>{
                rate = item.rating + rate
            })    
            setRating(Math.round(rate*12/data.rating.length)/10)
        } 
    }, [])
    const accept = async ()=>{
        setLoading(true)
        setNotice(false)
        const updateData = {
            provider: data.id,
            startsOn:new Date(),
            status:'inprogress'
        }
        const notifyData = {
            title:`Got New Order`,
            body:`${state.profile.name} accepted your proposal`
        }
        const dataAdd = {
            id:orderId, 
            time: new Date(), 
            type:'sell', 
            amount:result.get,
            txnId: Math.floor(Math.random()*100000000000)
        }
        const history = data.history ?[...data.history, dataAdd] : [dataAdd]
        await updateProviderProfile(data.id, {wallet: data.wallet-result.get, history})
        await updateOrder(updateData, orderId)
        Message({phone:'+'+data.id, message:messageTemplate({data, profile:state.profile, subCat:result},2)})
        sendPushNotification(data.token, notifyData)
        navigation.goBack()
        setLoading(false)
    }
    var distance = getDistance(
        { latitude: state.profile.coord.latitude, longitude: state.profile.coord.longitude },
        { latitude: data.coord.latitude, longitude: data.coord.longitude }
    )
    return (
        <View style={{flex:1}}>
            <Background/>
            {notice && <AcceptScreen data={data}  price={result.charge} accept={accept} setNotice={setNotice}/>}
            <View style={{height:HEIGHT*.05}}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding:20}}>
                    <RowView>
                        <Image source={{uri:data.url}} style={styles.image}/>
                        <View style={styles.container}>
                            <Text bold>{data.name}</Text>
                            <RowView style={{marginBottom:10}}>
                                {data.verified && <MaterialIcons name="verified" size={20} style={{marginRight:5}} color={color.blue} />}
                                <Text size={13}>{pro}</Text>
                            </RowView>
                            {data.rating ?<Text regular>{rating} <AntDesign name="star" size={15} color={color.active} /></Text>: <Text regular theme={color.inActive}>No Review</Text>}
                        </View>
                    </RowView>

                    <View style={styles.contentContainer}>
                        <Point text={`On ${proposalData.date}\n${proposalData.time}`}/>
                        <Point text={`+${data.id}`} onPress={()=>Linking.openURL(`tel:+${data.id}`)}>
                            <View style={{padding:5, backgroundColor:color.active, borderRadius:10, marginRight:10}}>
                                <Ionicons name="ios-call" size={15} color={color.white} />
                            </View>
                        </Point>
                        <Point onPress={()=>_openMap(data.coord, state.profile.name)}>
                            <RowView>
                                <MaterialCommunityIcons name="map-marker-distance" size={24} color={color.active}/>
                                <Text size={13} regular style={{marginLeft:10}}>{distance>=1000 ? distance/1000+' km' : distance+' m'} away</Text>
                            </RowView>
                        </Point>
                        <Point last text={`Since ${moment(data.createdOn).format('DD-MM-YYYY')}`}/>
                    </View>

                    {data.rating && <View style={{marginTop:10}}>
                        <Text size={12} style={{margin:10, marginBottom:-5}}>Customer Reviews</Text>
                        {
                            data.rating && data.rating
                            .sort((a,b)=>TimeDiff(a.postedAt).minutes-TimeDiff(b.postedAt).minutes)
                            .map(item=><Review key={Math.random().toString()} data={item}/>)
                        }
                    </View>}

                    
                    <Text>{'\n'}</Text>
                    <Text>{'\n'}</Text>
                </View>
            </ScrollView>
            {!loading ?
            <>
                {proposal && <Pressable onPress={()=>{setNotice(true)}} style={styles.accept}>
                    <Text bold>Hire Me!</Text>
                </Pressable>}
            </>:
            <Loading/>}
        </View>
    )
}

export default ServiceProfile

const styles = StyleSheet.create({
    container:{
        marginLeft:10,
        width:WIDTH-IMAGE_SIZE-50
    },
    contentContainer:{
        marginTop:20
    },
    okButton:{
        backgroundColor:color.active,
        borderRadius:10,
        alignSelf:'flex-end',
        padding:10,
        alignItems:'center'
    },
    Points:{
        borderBottomWidth:2,
        paddingVertical:10,
        borderBottomColor:color.lightDark,
        padding:10
    },
    image:{
        height:IMAGE_SIZE, 
        width:IMAGE_SIZE, 
        borderRadius:20, 
    },
    blueChip:{
        borderWidth:5,
        borderColor: color.blue
    },
    imageText:{
        position:'absolute',
        bottom:0,
        alignSelf:'center',
        padding:10,
        justifyContent:'center',
    },
    accept:{
        position:'absolute',
        bottom:0, 
        backgroundColor:color.active, 
        width:WIDTH/2, 
        alignItems:'center', 
        padding:10,
        elevation:5,
        borderRadius:10,
        elevation:5,
        margin:20,
        alignSelf:'center'
    }
})
