import React,{useState, useEffect} from 'react'
import { Dimensions, StyleSheet, View, Image, ScrollView, Pressable, BackHandler, Button } from 'react-native'

import { Ionicons, Entypo, MaterialIcons} from '@expo/vector-icons'; 
import LottieView from 'lottie-react-native';

import {Text, RowView} from 'styles'
import Loading from 'components/Loading'
import color from 'colors'
import {getServiceProvider, saveOrder, Message} from 'hooks/useData'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {DataConsumer} from 'context/data'
import getDistance from 'geolib/es/getDistance';
import { sendPushNotification } from 'middlewares/notification'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const IMAGE_SIZE = 110


const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'-45deg'}, {translateY:-100}]}}/>
    </View>
}

const InvitationService = ({onPress, data})=>{
    const [pressed, setPressed] = useState(false)
    // console.log(data)
    return <Pressable onPress={()=>RootNavigation.navigate(CONSTANT.ServiceProfile, {data, invitation:true})}>        
            <RowView style={styles.container}>
                <Image source={{uri:data.url}} style={{height:IMAGE_SIZE, width:IMAGE_SIZE}}/>
                <View style={{overflow:'hidden', justifyContent:'space-around', height:'100%', marginLeft:10}}>
                    <RowView>
                        <MaterialIcons name="verified" size={24} color={color.blue} />
                        <Text style={{width:WIDTH/2.3, marginLeft:5}} numberOfLines={1} size={18} bold>{data.name}</Text>
                    </RowView>
                    {
                        !pressed ? <Pressable onPress={()=>{setPressed(true); onPress(data)}} style={[styles.InviteButton,{backgroundColor: color.active,}]}>
                            <Text regular>Send Invite</Text>
                        </Pressable> :
                            <Pressable onPress={()=>{setPressed(false); onPress(data)}} style={styles.InviteButton}>
                                <RowView regular style={{color:color.inActive}}>
                                    <Ionicons name="checkmark-done" size={24} color={color.inActive} />
                                    <Text>{' '}Invited</Text>
                                </RowView>
                            </Pressable>
                    }
                </View>
            </RowView>
        </Pressable>
}

const Invitation = ({route, navigation}) => {
    const info = route.params
    const {state} = DataConsumer()
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(true)
    const [invited, setInvited] = useState([])
    const [data, setData] = useState()
    const Save=async()=>{
        setLoading(true)
        const id = 'ORD-'+Math.floor(Math.random()*1000000)
        delete info.categoryData;
        const DATA = {
            invited,
            type:'service',
            user:state.profile.id,
            info:{...info, created:new Date()},
            status:'posted',
            coord:state.profile.coord,
            Address:state.profile.Address,
            postedAt: new Date(),
            id
        }
        await saveOrder(DATA)

        const notifyData = {
            title:`Got An Invitation`,
            body:`${state.profile.name} has sent you an invitation`,
            data:{id}
        }
        const notifyDataFeed = {
            title:`Got An New Feed`,
            body:`${state.profile.name} give the proposal first hurry up!!`,
            data:{id}
        }
        data.map(({token})=>{
            sendPushNotification(token, notifyDataFeed)
        })
        data.filter(item=>invited.find(res=>res===item.id)).map(async ({token})=>sendPushNotification(token, notifyData))
        setSuccess(true)
        setTimeout(()=>{setSuccess(false);RootNavigation.navigate(CONSTANT.Library,{load:true})}, 3000)
        setLoading(false)
    }
    useEffect(() => {
        getServiceProvider(info.category).then(({data})=>{
            const sortedInvite = data.filter(item=>
                getDistance(
                    { latitude: state.profile.coord.latitude, longitude: state.profile.coord.longitude },
                    { latitude: item.coord.latitude, longitude: item.coord.longitude }
                ) <= info.categoryData.minDistance
            )
            setData(sortedInvite); 
            setLoading(false)
        })
        const backHandler = BackHandler.addEventListener('hardwareBackPress',navigation.goBack);
        return () => backHandler.remove();
    }, [])
    
    const Invite = (data)=>{
        invited.length === 0 && setInvited([data.id])
        const result = invited.filter(item=>item===data.id)
        result.length === 0 ? setInvited([...invited, data.id]):setInvited(invited.filter(item=>item!==data.id))
    } 

    return (
        <View style={{flex:1}}>
            <Background/>
           {!success? <>
                <View style={{height:HEIGHT*.02}}/>
                <View style={{margin:20}}>
                    <Text size={20} bold>Linkups</Text>
                    <Text size={13}>Invitations</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{margin:20, marginTop:0, flex:1}}>
                        {!loading ? <>
                            {
                                data.map(item=><InvitationService onPress={Invite} data={item} key={item.id} data={item}/>)
                            }
                        </>
                        :
                        <Loading/>
                        }
                    </View>
                </ScrollView>
                {!loading && <Pressable onPress={Save} style={{position:'absolute', bottom:0, width:WIDTH, alignItems:'center', backgroundColor:color.active, padding:20}}>
                    <Text regular>Submit</Text>                
                </Pressable>}
            </> :<View>            
                <LottieView
                    source={require('../../../assets/lottieFiles/loading.json')}
                    style={styles.loading}
                    autoPlay
                />
                <LottieView
                    source={require('../../../assets/lottieFiles/popper.json')}
                    style={{width:WIDTH, height:HEIGHT, position:'absolute'}}
                    autoPlay
                />
            </View>
            }
        </View>
    )
}

export default Invitation

const styles = StyleSheet.create({
    container:{
        backgroundColor:'rgba(34, 42, 56,0.8)',
        marginTop:10,
        height:IMAGE_SIZE
    },
    loading:{
        width:WIDTH,
        height:HEIGHT,
        alignSelf:'center',
    },
    InviteButton:{
        backgroundColor:color.lightDark, 
        padding:5, 
        alignItems:'center', 
        width:170,
        alignSelf:'center', 
        height:45, 
        justifyContent:'center', 
        alignItems:'center'
    }
})
