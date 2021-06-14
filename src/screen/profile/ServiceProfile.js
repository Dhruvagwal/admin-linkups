import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Dimensions, Image, ScrollView, Pressable, BackHandler, Linking, Platform } from 'react-native'
import { AntDesign, MaterialCommunityIcons, Ionicons, Entypo, MaterialIcons} from '@expo/vector-icons'; 
import getDistance from 'geolib/es/getDistance';

import {Text, RowView} from 'styles'
import color from 'colors'
import moment from 'moment';
import Loading from 'components/Loading'
import { updateOrder, Message } from 'hooks/useData'
import {DataConsumer} from 'context/data'
import { sendPushNotification } from 'middlewares/notification'
import CONSTANT from 'navigation/navigationConstant'
import TimeDiff from 'middlewares/TimeDiff'

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

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'-30deg'}, {translateY:-100}]}}/>
    </View>
}

const IMAGE_SIZE = 200

const Review=({data={}})=><View style={{...styles.contentContainer, backgroundColor: 'rgba(34, 42, 56,0.8)',}}>
    <RowView>
        <View style={{marginLeft:10}}>
            <Text regular>
                <AntDesign name="star" size={15} color={color.active} /> {Math.round(data.rating*1.2*100)/100}
            </Text>
            <Text regular>{data.subCat}</Text>
        </View>
    </RowView>
    <View style={{marginHorizontal:10}}>
        <Text regular size={12} style={{width:'100%'}} numberOfLines={2}>{data.review}</Text>
    </View>
    <Text style={{position: 'absolute',right: 10,top:10}} size={13}>{TimeDiff(data.postedAt).diff}</Text>
</View>

const Point = ({children, last=false, text, onPress=()=>{}})=><Pressable onPress={onPress} android_ripple={{color:color.dark}} style={{...styles.Points, borderBottomWidth:last ? 0:2}}>
    <RowView>
        {children}
        <Text regular>{text}</Text>
    </RowView>
</Pressable> 

const ServiceProfile = ({route, navigation}) => {
    const {data, proposal, orderId, proposalData, invitation} = route.params
    const [loading, setLoading] = useState(false)
    const [pro, setPro] = useState('')
    const [rating, setRating] = useState(0)
    const {state} = DataConsumer()
    useEffect(() => {
        var rate = 0
        const result = state.category.find(item=>item.id === data.category)
        setPro(result.name)  
        if(data.rating){
            data.rating.map(item=>{
                rate = item.rating + rate
            })    
            setRating(Math.round(rate*12/data.rating.length)/10)
        } 
    }, [])
    const accept = async ()=>{
        setLoading(true)
        const updateData = {
            provider: data.id,
            startsOn:new Date(),
            status:'inprogress'
        }
        const notifyData = {
            title:`Got New Order`,
            body:`${state.profile.name} accepted your proposal`
        }
        await updateOrder(updateData, orderId)
        Message({phone:'+'+data.id, message:`Congratulation,\n${state.profile.name} accepted your proposal as ${pro}.`})
        sendPushNotification(data.token, notifyData)
        navigation.navigate(CONSTANT.Library,{load:true})
        setLoading(false)
    }
    var distance = getDistance(
        { latitude: state.profile.coord.latitude, longitude: state.profile.coord.longitude },
        { latitude: data.coord.latitude, longitude: data.coord.longitude }
    )

    
    return (
        <View style={{flex:1}}>
            <Background/>
            <View style={{height:HEIGHT*.05}}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding:20}}>
                    <Image source={{uri:data.url}} style={styles.image}/>
                    <View style={styles.container}>
                        <View style={{alignSelf:'center', marginBottom:10, alignItems:'center'}}>
                            <Text size={20} bold>{data.name}</Text>
                            <RowView style={{alignSelf: 'center',}}>
                                {(data.rating && data.history.length>100)&& <MaterialIcons name="verified" size={24} color={color.blue} />}
                                <Text> {pro}</Text>
                            </RowView>
                        </View>
                        <View style={{padding:10}}>
                            <RowView>
                                <Pressable onPress={()=>_openMap(data.coord, state.profile.name)} android_ripple={{color:color.dark}} style={[styles.options, {borderRightWidth:2.5, borderRightColor:color.lightDark}]}>
                                    <Text size={20} bold>{distance>=1000 ? distance/1000+'km' : distance+'m'} <MaterialCommunityIcons name="map-marker-distance" size={24} color={color.active}/></Text>
                                    <Text>away</Text>
                                </Pressable>
                                <View style={styles.options}>
                                    {data.rating ?<Text size={20} bold>{rating} <AntDesign name="star" size={24} color={color.active} /></Text>: <Text size={20} bold>No</Text>}
                                    <Text>Rating</Text>
                                </View>
                            </RowView>
                        </View>
                    </View>


                    <Text size={12} style={{margin:10, marginBottom:-5}}>Details</Text>
                    <View style={styles.contentContainer}>
                        {!invitation && <Point>
                            <RowView>
                                <Text regular>Price:</Text>
                                <Text size={20} bold> {`₹ ${proposalData.price}`}</Text>
                            </RowView>
                        </Point>}
                        {
                            !invitation && 
                            <Point text={`${proposalData.date}\n${proposalData.time}`}/>
                        }
                        <Point text={`+${data.id}`} onPress={()=>Linking.openURL(`tel:+${data.id}`)}>
                            <View style={{padding:5, backgroundColor:color.active, borderRadius:10, marginRight:10}}>
                                <Ionicons name="ios-call" size={15} color={color.white} />
                            </View>
                        </Point>
                        <Point text={data.Address} onPress={()=>_openMap(data.coord, state.profile.name)}/>
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
                {proposal && <Pressable onPress={accept} style={{position:'absolute',bottom:0, backgroundColor:color.active, width:'100%', alignItems:'center', padding:15}}>
                    <Text size={20} bold>Accept</Text>
                </Pressable>}
            </>:
            <Loading/>}
        </View>
    )
}

export default ServiceProfile

const styles = StyleSheet.create({
    container:{
        backgroundColor:'rgba(34, 42, 56,0.0)',
        marginTop:-IMAGE_SIZE/2,
        paddingTop:IMAGE_SIZE/2+10,
        borderRadius:20,
        paddingBottom:10
    },
    options:{
        alignItems:'center',
        width:'50%'
    },
    contentContainer:{
        backgroundColor:'rgba(34, 42, 56,0.0)',
        marginTop:10,
        padding:10,
        borderRadius:20
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
        borderRadius:IMAGE_SIZE, 
        alignSelf:'center', 
        zIndex:1000,
        overflow:'hidden'
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
    }
})
