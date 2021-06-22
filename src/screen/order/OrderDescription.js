import React, {useEffect, useState} from 'react'
import { StyleSheet, View, Dimensions, Image, ScrollView, Pressable, BackHandler } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading' 
import ScreenModal from 'components/ScreenModal'
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

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1550, width:'100%',transform:[{rotate:'-36deg'}]}}/>
    </View>
}

const Point = ({last=false,text='',bold=false, theme=color.white})=><RowView style={{...styles.Points, borderBottomWidth:last ? 0:2}}>
    <Text theme={theme} size={13} style={{marginLeft:10}} regular={!bold} bold={bold}>{text}</Text>
</RowView>


const OrderDescription = ({route}) => {
    const {id} = route.params
    const {state:{profile}} = DataConsumer()
    const [data, setData] = useState({})
    const [SubCat, setSubCat] = useState({})
    const [category, setCategory] = useState({})
    const [proposal, setProposal] = useState([])
    const [loading, setLoading] = useState(true)
    const [provider, setProvider] = useState([])
    const [review, setReview] = useState(false)
    const [miniLoading, setMiniLoading] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const [isCancel, setIsCancel] = useState(false)
    const status = ['posted', 'inprogress', 'completed', 'paid','cancelled']
    const url = SubCat.reason && SubCat.reason.find(({id})=>id===data.info.problem)
    const Delete =async ()=>{
        const notifyData = {
            title:`Order Cancelled`,
            body:`${profile.name} Cancelled the order. Your connects is refunded to your account`,
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
    
    if((data.status==='paid'|| data.status==='completed') && !review ){
        const isTrue = provider.rating===undefined || provider.rating.find(({id, subCat})=>profile.id===id && subCat===SubCat.name)
        !isTrue && setReview(true)
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
        return <ImageViewer uri={data.url?data.url:( url ? url.url : SubCat.url)} showImage={showImage} setShowImage={setShowImage}/>
    }
    else return (
        !loading ? <View style={{flex:1}}>        
                {isCancel && <ScreenModal>
                    <Text regular>Are you sure{'\n'}you want to cancel it ?</Text>
                    <RowView style={{alignSelf:'flex-end'}}>
                        <Pressable onPress={()=>setIsCancel(false)}  style={{padding:10}}>
                            <Text bold>NO</Text>
                        </Pressable>
                        <Pressable onPress={Delete} style={{padding:10}}>
                            <Text theme={color.red} bold>YES</Text>
                        </Pressable>
                    </RowView>
                </ScreenModal>}  
                <View style={{height:HEIGHT*.02}}/>
                <Background/>
                {review && <FeedBackScreen subCat={SubCat.name} data={data} provider={provider}/>}
                <View style={{margin:10, marginTop:20, flex:1}}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{height:HEIGHT}}>    
                        <View style={{marginTop:10}}>
                            <View style={{...styles.container, backgroundColor: '#0000', marginBottom:20}}>
                                <RowView style={{height:100}}>
                                    <Pressable onPress={()=>setShowImage(true)}>
                                        <Image source={{uri:data.url?data.url:( url ? url.url : SubCat.url)}} style={{width:100, height:100, borderRadius:10}}/>
                                    </Pressable>
                                    <View style={{alignItems:'flex-start', height:100, marginLeft:10, justifyContent:'space-between'}}>
                                        <Text style={{width:WIDTH*.6}} bold numberOfLines={2} adjustsFontSizeToFit>{SubCat.name}</Text>
                                        <Text size={13}>Status:<Text bold style={{textTransform:'capitalize', color:color.active}} size={13}> {data.status}</Text></Text>
                                        <Text size={13}>{TimeDiff(data.postedAt).diff}</Text>
                                    </View>
                                </RowView>
                            </View>
                            {(data.status!=='posted'&& data.status!=='cancelled') && <StatusTracker data={data}/>}
                            <View style={{...styles.container, backgroundColor: '#0000',paddingTop:10}}>
                                <Point bold  theme={color.blue} text={`Service Charge: ₹ ${SubCat.charge}`}/>
                                <Point text={category.name}/>
                                <Point last text={data.info.problem}/>
                            </View>
                            {(data.status==='posted' && data.proposal===undefined) && <View style={{backgroundColor:color.lightDark, padding:10, borderRadius:10, elevation:3}}>
                                <Text theme={color.blue} size={13} bold>
                                    NOTE:{'\n'}Your nearby {category.name} provider will call you earlier.
                                </Text>
                            </View>
                            }
                            {data.status !== status[4] &&
                                <>
                                    {data.status===status[0]?
                                        <>
                                        {proposal.length>0 && <View style={{marginTop:10}}>
                                            <Text style={{margin:10}} size={12}>Intrested</Text>
                                            {
                                                proposal.map(item=><ServiceProviderListView order={data} key={Math.random().toString()} proposalData={data.proposal.find(response=>response.id===item.id)} orderId={data.id} data={item} category={category} proposal/>)
                                            }
                                        </View>}
                                        </>:
                                        <View style={{marginTop:10}}>
                                            <Text style={{margin:10}} size={12}>Provider</Text>
                                            <ServiceProviderListView key={Math.random().toString()} order={data} proposalData={data.proposal.find(response=>response.id===provider.id)} data={provider} category={category}/>
                                        </View>
                                    }
                                </>
                            }
                        </View>
                        <Text>{'\n'}</Text>
                    </ScrollView>
                    <View style={{marginBottom:10}}>
                        {!miniLoading ?
                            <RowView style={{justifyContent:'space-around'}}>
                                {data.status===status[0] && 
                                <>
                                <Pressable onPress={()=>BackHandler.exitApp()}>
                                    <RowView style={{...styles.container, alignSelf: 'center', width:WIDTH/2.5, opacity:1, padding:20, alignItems:'center', justifyContent:'center', backgroundColor:color.lightDark, elevation:5}}>
                                        <Text style={{color:color.red}} bold>Exit</Text>
                                    </RowView>
                                </Pressable>
                                <Pressable onPress={()=>setIsCancel(true)}>
                                    <RowView style={{...styles.container, alignSelf: 'center', width:WIDTH/2.5, opacity:1, padding:20, alignItems:'center', justifyContent:'center', backgroundColor:color.lightDark, elevation:5}}>
                                        <Text style={{color:color.red}} bold>Cancel</Text>
                                    </RowView>
                                </Pressable>
                                </>}
                            </RowView>
                            :
                            <View>
                                <Loading whole={false}/>
                            </View>
                        }
                    </View>
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
        backgroundColor: 'rgba(18, 18, 18,0.8)',
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
