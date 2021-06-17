import React, {useEffect, useState} from 'react'
import { StyleSheet, View, Dimensions, Image, ScrollView, Pressable } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading' 
import ServiceProviderListView from 'components/ServiceProviderListView'
import {DataConsumer} from 'context/data'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {updateOrder, getDataById, updateUserProfile} from 'hooks/useData'
import FeedBackScreen from './FeedBackScreen'
import { sendPushNotification } from 'middlewares/notification'
import TimeDiff from 'middlewares/TimeDiff'
import ImageViewer from 'components/ImageViewer';
import StatusTracker from 'components/StatusTracker'


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
    const [proposal, setProposal] = useState([])
    const [review, setReview] = useState(false)
    const [loading, setLoading] = useState(true)
    const [provider, setProvider] = useState([])
    const [miniLoading, setMiniLoading] = useState(false)
    const [showImage, setShowImage] = useState(false)
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
                sendPushNotification(res.data.token, notifyData)
            })
        })
        RootNavigation.navigate(CONSTANT.Library,{load:true})
        setMiniLoading(false)
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
                var Propsallist = []
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

    if(showImage){
        return <ImageViewer uri={data.url?data.url:SubCat.url} showImage={showImage} setShowImage={setShowImage}/>
    }
    else return (
        !loading ? <View style={{flex:1}}>          
                <View style={{height:HEIGHT*.02}}/>
                <Background/>
                {review && <FeedBackScreen subCat={SubCat.name} data={data} provider={provider}/>}
                <View style={{margin:10, marginTop:20, flex:1}}>
                    <ScrollView showsVerticalScrollIndicator={false}>    
                        <View style={{marginTop:10}}>
                            <View style={{...styles.container, backgroundColor: '#0000', marginBottom:20}}>
                                <RowView style={{height:100}}>
                                    <Pressable onPress={()=>setShowImage(true)}>
                                        <Image source={{uri:data.url?data.url:SubCat.url}} style={{width:100, height:100, borderRadius:10}}/>
                                    </Pressable>
                                    <View style={{alignItems:'flex-start', height:100, marginLeft:10, justifyContent:'space-between'}}>
                                        <Text style={{width:WIDTH*.6}} bold numberOfLines={2} adjustsFontSizeToFit>{SubCat.name}</Text>
                                        <Text size={13}>Status:<Text regular style={{textTransform:'capitalize', color:color.active}} size={13}> {data.status}</Text></Text>
                                        <Text size={13}>{TimeDiff(data.postedAt).diff}</Text>
                                    </View>
                                </RowView>
                            </View>
                            {data.status!=='posted'&&'cancelled' && <StatusTracker data={data}/>}
                            <Text style={{margin:10, marginBottom:0}} size={12}>Info</Text>
                            <View style={{...styles.container, backgroundColor: '#0000',paddingTop:0}}>
                                <Point text={category.name}/>
                                <Point text={data.info.problem}/>
                                <Point last text={`Service Charge: ₹${SubCat.charge}`}/>
                            </View>
                            {data.status !== status[4] &&
                                <>
                                    {data.status===status[0]?
                                        <>
                                        {proposal.length>0 && <View style={{marginTop:10}}>
                                            <Text style={{margin:10}} size={12}>Intrested</Text>
                                            {
                                                proposal.map(item=><ServiceProviderListView key={Math.random().toString()} proposalData={data.proposal.find(response=>response.id===item.id)} orderId={data.id} data={item} category={category} proposal/>)
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
