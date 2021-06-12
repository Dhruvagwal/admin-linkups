import React, {useEffect, useState} from 'react'
import { StyleSheet, View, Dimensions, Image, ScrollView, Button, Pressable } from 'react-native'
import { MaterialCommunityIcons, AntDesign, MaterialIcons } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading' 
import ServiceProviderListView from 'components/ServiceProviderListView'
import {DataConsumer} from 'context/data'
import DateFormat from 'hooks/DateFormat'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {updateOrder, getDataById, updateProviderProfile, Message} from 'hooks/useData'
import moment from 'moment';
import FeedBackScreen from './FeedBackScreen'
import { sendPushNotification } from 'middlewares/notification'
import TimeDiff from 'middlewares/TimeDiff'


const HEIGHT= Dimensions.get('screen').height
const WIDTH= Dimensions.get('screen').width

const Background = ()=><View style={[{flex:1, alignItems:'stretch',flexDirection:'row'},StyleSheet.absoluteFillObject]}>
    <View style={{backgroundColor:color.dark, width:'85%'}}/>
    <View style={{backgroundColor:color.secondaryDark, width:'15%'}}/>
</View>

const Point = ({last=false,text=''})=><RowView style={{...styles.Points, borderBottomWidth:last ? 0:2}}>
    <Text style={{marginLeft:10}} regular>{text}</Text>
</RowView>


const OrderDescription = ({route}) => {
    const {id} = route.params
    const {state:{profile}} = DataConsumer()
    const [data, setData] = useState({})
    const [SubCat, setSubCat] = useState({})
    const [category, setCategory] = useState({})
    const [invited, setInvited] = useState([])
    const [proposal, setProposal] = useState([])
    const [review, setReview] = useState(false)
    const [loading, setLoading] = useState(true)
    const [provider, setProvider] = useState([])
    const [miniLoading, setMiniLoading] = useState(false)
    const status = ['posted', 'inprogress', 'completed', 'paid','cancelled']
    const Delete =async ()=>{
        const notifyData = {
            title:`Order Cancelled`,
            body:`${profile.name} Cancelled the order. Your connects is refunded to your account`
        }
        setMiniLoading(true)
        await updateOrder({status:status[4]}, data.id)
        data.proposal && await data.proposal.map(async({id})=>{
            await getDataById('serviceProvider',id).then(async (res)=>{
                const dataAdd = {id:data.id, time: new Date(), type:'return', amount:SubCat.charge}
                await updateProviderProfile(id,{wallet:res.data.wallet+SubCat.charge, history:[...res.data.history, dataAdd]})
                sendPushNotification(res.data.token, notifyData)
            })
        })
        RootNavigation.navigate(CONSTANT.Library,{load:true})
        setMiniLoading(false)
    }

    const checkout =async ()=>{
        const UpdatedData = {
            status:status[3],
            paidOn:moment().format('LLL')
        }
        const notifyData = {
            title:`Payment Done`,
            body:`${profile.name} paid you`
        }
        await updateOrder(UpdatedData,data.id )
        await sendPushNotification(provider.token, notifyData)
        setReview(true)
    }
    
    useEffect(() => {
        if(loading){
            getDataById('order',id).then(async (response)=>{
                setData(response.data)
                await getDataById('Category', response.data.info.category).then(catRes=>{
                    setCategory(catRes.data)
                    const result = catRes.data.subCategory.find(item=>item.id===response.data.info.subCategory)
                    setSubCat(result)
                    setLoading(false)
                })
            })
        }else{
            if (data.status===status[0]){
                var Invitedlist = []
                var Propsallist = []
                data.invited>0 && data.invited.map(async item=>{
                    await getDataById('serviceProvider',item)
                    .then(({data})=>{
                        Invitedlist = [...Invitedlist, data]
                        setInvited(Invitedlist)
                    })
                });
                if(data.proposal!== undefined && data.proposal.length > 0 ){
                    data.proposal.map(async item=>{
                    await getDataById('serviceProvider',item.id)
                    .then(({data})=>{
                        Propsallist = [...Propsallist, data]
                        setProposal(Propsallist)
                    })
                })}
            }else if(data.status!==status[4]){
                getDataById('serviceProvider',data.provider).then(({data})=>{
                    setProvider(data)
                })
            }
        }
    }, [route.params, loading])
    return (
        !loading ? <View style={{flex:1}}>          
                <View style={{height:HEIGHT*.02}}/>
                <Background/>
                {review && <FeedBackScreen data={data} provider={provider}/>}
                <View style={{margin:20, flex:1}}>
                    <Text size={20} bold>Linkups</Text>
                    <Text size={13}>Order Detail</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>    
                        <View style={{marginTop:10}}>
                            <View style={{...styles.container, backgroundColor: '#0000'}}>
                                <RowView style={{height:100}}>
                                    <Image source={{uri:SubCat.url}} style={{width:100, height:100}}/>
                                    <View style={{alignItems:'flex-start', height:100, marginLeft:10, justifyContent:'space-between'}}>
                                        <Text style={{width:WIDTH*.6}} bold numberOfLines={2} adjustsFontSizeToFit>{SubCat.name}</Text>
                                        <Text size={13}>Status:<Text regular style={{textTransform:'capitalize', color:color.active}} size={13}> {data.status}</Text></Text>
                                        <Text size={13}>{TimeDiff(data.postedAt).diff}</Text>
                                    </View>
                                </RowView>
                            </View>
                            <Text style={{margin:10, marginBottom:0}} size={12}>Info</Text>
                            <View style={{...styles.container, backgroundColor: '#0000',paddingTop:0}}>
                                <Point text={category.name}/>
                                <Point text={data.info.problem}/>
                                {(data.status===status[1] || data.status===status[2] || data.status===status[3]) && <Point text={'Starts on: '+moment(data.startsOn).format('LLL')}/>}
                                {data.status===status[0] && <Point text={`${moment(data.postedAt).format('LL')} \n${data.info.time}`} />}
                                {(data.status===status[2] || data.status===status[3])&& <Point text={`Ends on: ${moment(data.endsOn).format('LLL')}`} />}
                                {(data.status===status[3])&& <Point text={`Paid on: ${moment(data.paidOn).format('LLL')}`} />}
                            </View>
                            {data.status !== status[4] &&
                                <>
                                    {data.status===status[0]?
                                        <>
                                        {proposal.length>0 && <View style={{marginTop:10}}>
                                            <Text style={{margin:10}} size={12}>Proposals</Text>
                                            {
                                                proposal.map(item=><ServiceProviderListView key={Math.random().toString()} proposalData={data.proposal.find(response=>response.id===item.id)} orderId={data.id} data={item} category={category} proposal/>)
                                            }
                                        </View>}
                                        {invited.length>0 && <View style={{marginTop:10}}>
                                            <Text style={{margin:10}} size={12}>Invited</Text>
                                            {
                                                invited.map(item=><ServiceProviderListView key={Math.random().toString()} data={item} invitation/>)
                                            }
                                        </View>}
                                        </>:
                                        <View style={{marginTop:10}}>
                                            <Text style={{margin:10}} size={12}>Provider</Text>
                                            <ServiceProviderListView key={Math.random().toString()} orderId={data.id} proposalData={data.proposal.find(response=>response.id===provider.id)} data={provider} category={category}/>
                                        </View>
                                    }
                                </>
                            }
                        </View>
                        <Text>{'\n'}</Text>
                        {!miniLoading ?
                            <>
                                {data.status===status[0] && <Pressable onPress={Delete}>
                                    <RowView style={{...styles.container, opacity:1, padding:20, alignItems:'center', justifyContent:'center'}}>
                                        <Text style={{color:color.red}} regular>Cancel</Text>
                                    </RowView>
                                </Pressable>}
                            </>
                            :
                            <View>
                                <Loading whole={false}/>
                            </View>
                        }
                    </ScrollView>
                </View>
                {
                    data.status === status[2] && <Pressable onPress={checkout} style={styles.bottomButton}>
                        <Text regular>Checkout</Text>
                    </Pressable>
                }
        </View>
        :
        <Loading/>
    )
}

export default OrderDescription

const styles = StyleSheet.create({
    button:{
        backgroundColor: color.active,
        padding: 20,
        width:WIDTH,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:0
    },
    container:{
        padding:10, 
        backgroundColor: 'rgba(34, 42, 56,0.8)',
        borderRadius:20
    },
    Points:{
        borderBottomWidth:2,
        paddingVertical:10,
        borderBottomColor:color.lightDark
    },
    bottomButton:{
        backgroundColor: color.active,
        padding:20,
        alignItems:'center'
    }
})
