import React, {useState} from 'react'
import { StyleSheet, Dimensions, View, ScrollView, Image, Pressable } from 'react-native'
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import {DataConsumer} from 'context/data'
import Loading from 'components/Loading'
import Calendar from 'components/calendar'
import ScreenModal from 'components/ScreenModal'

import {updateOrder, updateProfile} from 'hooks/useData'
import { TextInput } from 'react-native-gesture-handler';

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
    <Text style={{marginLeft:10, marginBottom:5}}>Details</Text>
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
        <Point text='2.5 Meters away from you'>
            <MaterialCommunityIcons name="map-marker-distance" size={ICON_SIZE} color={color.active} />
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

const AcceptScreen = ({setAccept, profile, data, Update})=>{
    const [date, setDate] =useState(new Date())
    const [price, setPrice] =useState()

    const Accept = async ()=>{
        const proposalData = {
            id:profile.id,
            date,
            price
        }
        const proposed = profile.proposed === undefined ? [data.id]:[...profile.proposed, data.id]
        const proposal = data.proposal === undefined ? [proposalData]:[...data.proposal,proposalData ]
        const invitation = data.invited.filter(item=>item!==profile.id)
        await updateProfile({proposed})
        await updateOrder({proposal, invited:invitation}, data.id)
        await Update()
        setAccept(false)
    }

    return <ScreenModal>
        <View>
            <Text style={{alignSelf:'center', marginBottom:20}} size={20} regular>Details</Text>
            <TextInput 
                placeholder='Price' 
                style={styles.TextInput} 
                placeholderTextColor={color.inActive}
                keyboardType='number-pad'
                onChangeText={setPrice}
            />
            <Text style={{marginBottom:10, marginTop:20}} size={12}>Delieverd on</Text>
            <Calendar date={date} setDate={setDate}/>
            <Pressable onPress={Accept} style={styles.button}>
                <RowView>
                    <Text regular>Send </Text>
                    <Ionicons name="send" size={24} color={color.white} />
                </RowView>
            </Pressable>
        </View>
    </ScreenModal>
}

const Index = ({route}) => {
    const {data, SubCat, result, invited} = route.params
    const [loading, setLoading] = useState(false)
    const [accept, setAccept] = useState(false)
    const {state:{profile}, Update} = DataConsumer()
    return (
        <View style={{flex:1, paddingTop:HEIGHT*.1, padding: 10,}}>
            <ScrollView>
                <TopContainer SubCat={SubCat} data={data} result={result}/>
                <MiddleContainer SubCat={SubCat} data={data} result={result}/>
                <Category data={data} SubCat={SubCat} result={result}/>
                <Text>{'\n'}</Text>
                <Text>{'\n'}</Text>
            </ScrollView>
            {accept && <AcceptScreen setAccept={setAccept} data={data} profile={profile} Update={Update}/>}
            {!invited && <>
            {
                !loading ?
                <Pressable onPress={()=>setAccept(true)} style={styles.bottomButton}>
                    <Text regular>Accept</Text>
                </Pressable>
                :
                <View style={[styles.bottomButton, {backgroundColor:color.lightDark, padding:15}]}>
                    <Loading/>
                </View>
            }</>}
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    bottomButton:{
        backgroundColor:color.active,
        padding: 20,
        position: 'absolute',
        bottom:0,
        width:WIDTH,
        alignItems:'center',
        justifyContent:'center'
    },
    TopContainer:{
        backgroundColor:color.elevatedDark,
        borderRadius:10,
        overflow: 'hidden',
        height:HEIGHT*.15,
        padding: 10,
    },
    Point:{
        borderTopWidth:2,
        borderTopColor:color.lightDark,
        paddingVertical:10
    },
    contentContainer:{
        backgroundColor:color.elevatedDark, 
        padding: 10,
        borderRadius:10
    },
    tag:{
        backgroundColor:color.lightDark,
        padding:5,
        marginHorizontal:5,
        borderRadius:10,
        flexGrow:1,
        alignItems:'center'
    },
    TextInput:{
        fontFamily:'Montserrat-Regular',
        fontSize:18,
        backgroundColor:color.lightDark,
        padding:10, 
        borderRadius:10,
        color:color.white,
        textAlign:'center'
    },
    button:{
        backgroundColor:color.blue,
        padding:10,
        alignSelf: 'center',
        borderRadius:10,
        marginTop:20
    }
})
