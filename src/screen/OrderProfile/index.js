import React, {useState, useEffect} from 'react'
import { StyleSheet, Dimensions, View, ScrollView, Image, Pressable } from 'react-native'
import { MaterialCommunityIcons, MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import {DataConsumer} from 'context/data'
import Loading from 'components/Loading'
import {getUsersDetailsById} from 'hooks/useData'
import styles from './stylesSheet'
import AcceptScreen from './AcceptScreen'
import {updateOrder, updateProfile} from 'hooks/useData'
import moment from 'moment';

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const TopContainer = ({SubCat={}, data={}, result={}})=><RowView style={styles.TopContainer}>
    <Image source={{uri:SubCat.url}} style={{height:'100%', width:'30%', resizeMode:'center'}}/>
    <View style={{alignItems:'flex-start', justifyContent:'space-between', height: '85%',marginLeft:10}}>
        <Text style={{width:WIDTH/1.7}} size={18} regular>{SubCat.name}</Text>
        <Text size={13}>{result.name}</Text>
        <Text size={13}>Posted 12 min ago</Text>
    </View>
</RowView> 

const Point = ({children, text, top=false})=><RowView style={{...styles.Point, borderTopWidth : top?0:2}}>
    {children}
    <Text style={{marginLeft:10}}>{text}</Text>
</RowView>

const ICON_SIZE = 25
const MiddleContainer = ({SubCat={}, data={}, result={}})=><View style={{marginTop:20}}>
    <Text size={13} style={{marginLeft:10, marginBottom:5}}>Order Details</Text>
    <View style={styles.contentContainer}>
        <Point top text={`Timing: ${data.info.timing}`}>
            <MaterialCommunityIcons name="clock-time-five" size={ICON_SIZE} color={color.active} />
        </Point>
        <Point text='5 Offers'>
            <MaterialIcons name="local-offer" size={ICON_SIZE} color={color.active} />
        </Point>
        <Point text='Deleivery'>
            <MaterialCommunityIcons name="truck-delivery" size={ICON_SIZE} color={color.active} />
        </Point>
    </View>
</View>


const Tag = ({text})=><View style={styles.tag}>
    <Text regular>{text}</Text>
</View> 

const Category = ({SubCat={}, data={}, result={}})=><View style={{marginTop:20}}>
    <Text style={{marginLeft:10, marginBottom:5}}>Tags</Text>
    <View style={styles.contentContainer}>
        <RowView >
            <Tag text={result.name} />
            <Tag text={SubCat.name} />
        </RowView>
        <RowView style={{marginTop:10}}>
            <Tag text={data.info.problem} />
        </RowView>
    </View>
</View>

const CustomerDetail = ({user={}})=><View style={{marginTop:20}}>
    <Text style={{marginLeft:10, marginBottom:5}} size={13}>Customer Details</Text>
    <View style={styles.contentContainer}>
        <Point top>
            <RowView>
                <View style={{padding:5, backgroundColor:color.active, borderRadius:10}}>
                    <Ionicons name="ios-call" size={24} color={color.white} />
                </View>
                <Text regular style={{marginLeft:10}}>{user.name}</Text>
            </RowView>
        </Point>
        <Point text='2.5 Meters away from you'>
            <MaterialCommunityIcons name="map-marker-distance" size={ICON_SIZE} color={color.active} />
        </Point>
    </View>
</View>


const ProposalDetail = ({data={}})=><View style={{marginTop:20}}>
    <Text size={13} style={{marginLeft:10, marginBottom:5}}>Proposal Details</Text>
    <View style={styles.contentContainer}>
        <Point top text={`${data.date}\n3:00 Am to 6:00Pm`}>
            <MaterialCommunityIcons name="clock-time-five" size={ICON_SIZE} color={color.active} />
        </Point>
        <Point>
            <RowView>
                <MaterialIcons name="local-offer" size={ICON_SIZE} color={color.active} />
                <Text size={18} style={{marginLeft:10}} regular>₹{data.price}</Text>
            </RowView>
        </Point>
    </View>
</View>


const Index = ({route}) => {
    const {data, SubCat, result, invited, feed, progress,completed, posted} = route.params
    const [loading, setLoading] = useState(true)
    const [accept, setAccept] = useState(false)
    const [user, setUser] = useState()
    const {state:{profile}, Update} = DataConsumer()
    useEffect(()=>{
        getUsersDetailsById(data.user).then(({data})=>{
            setUser(data)
            setLoading(false)
        })
    },[])

    const Delete = async ()=>{
        if (posted){
            const proposal = data.proposal.filter(item=>item.id!==profile.id)
            await updateOrder({proposal}, data.id)
        }
        else if(invited){
            const invitedList = data.invited.filter(item=>item!==profile.id)
            await updateOrder({invited:invitedList}, data.id)
        }
        await Update()
    }

    const Complete = async ()=>{
        const completeData = {
            endsOn: moment().format('LLL'),
            status:'completed'
        }
        await updateOrder(completeData, data.id)
    }
    return (
        !loading ? <>
            <Background/>
            <View style={{flex:1, paddingTop:HEIGHT*.1, padding: 10,}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TopContainer SubCat={SubCat} data={data} result={result}/>
                    {(progress || posted )&& <ProposalDetail data={data.proposal.find(item=>item.id===profile.id)}/>}
                    <MiddleContainer SubCat={SubCat} data={data} result={result}/>
                    <CustomerDetail user={user}/>
                    <Category data={data} SubCat={SubCat} result={result}/>
                    <Text>{'\n'}</Text>
                    <Text>{'\n'}</Text>
                    {
                        (posted || invited) && <Pressable 
                            onPress={Delete}
                            style={{marginBottom:invited ? 80:0}}
                        >
                            <RowView style={styles.delete} >
                                <MaterialIcons name="delete" size={24} color={color.white}/>
                                <Text regular> Delete</Text>
                            </RowView>
                        </Pressable> 
                    }
                </ScrollView>
                {accept && <AcceptScreen setAccept={setAccept} data={data} profile={profile} Update={Update}/>}
                {(feed || invited)&& <>
                    <Pressable 
                        onPress={()=>setAccept(true)} 
                        style={styles.bottomButton}
                        android_ripple={{color:color.active}}
                    >
                        <Text regular>Accept</Text>
                    </Pressable>
                    </>
                }
                {(progress)&& <>
                    <Pressable 
                        onPress={Complete} 
                        style={[styles.bottomButton,{backgroundColor:color.blue}]}
                        android_ripple={{color:color.active}}
                    >
                        <Text regular>Completed</Text>
                    </Pressable>
                    </>
                }
            </View>
        </>: <Loading/>
    )
}



export default Index

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'-30deg'}, {translateY:-100}]}}/>
    </View>
}
