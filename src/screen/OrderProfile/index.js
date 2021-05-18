import React, {useState} from 'react'
import { StyleSheet, Dimensions, View, ScrollView, Image, Pressable } from 'react-native'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import {DataConsumer} from 'context/data'
import Loading from 'components/Loading'
import {updateOrder, updateProfile} from 'hooks/useData'

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
const Index = ({route}) => {
    const {data, SubCat, result} = route.params
    const [loading, setLoading] = useState(false)
    const {state:{profile}, Update} = DataConsumer()
    const Accept = async ()=>{
        setLoading(true)
        const invitation = profile.invitation === undefined ? [data.id]:[...profile.invitation, data.id]
        const proposal = data.proposal === undefined ? [profile.id]:[...data.proposal, profile.id]
        await updateProfile({invitation})
        await updateOrder({proposal}, data.id)
        await Update()
        setLoading(false)
    }
    return (
        <View style={{flex:1, paddingTop:HEIGHT*.1, padding: 10,}}>
            <ScrollView>
                <TopContainer SubCat={SubCat} data={data} result={result}/>
                <MiddleContainer SubCat={SubCat} data={data} result={result}/>
                <Category data={data} SubCat={SubCat} result={result}/>
                <Text>{'\n'}</Text>
                <Text>{'\n'}</Text>
            </ScrollView>
            {
                !loading ?
                <Pressable onPress={Accept} style={styles.bottomButton}>
                    <Text regular>Accept</Text>
                </Pressable>
                :
                <View style={[styles.bottomButton, {backgroundColor:color.lightDark, padding:15}]}>
                    <Loading/>
                </View>
            }
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
    }
})
