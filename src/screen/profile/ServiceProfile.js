import React from 'react'
import { StyleSheet, View, Dimensions, Image, ScrollView, StatusBar, ImageBackground } from 'react-native'
import { AntDesign, MaterialCommunityIcons, Ionicons, Entypo, SimpleLineIcons, MaterialIcons} from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import moment from 'moment';

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'-30deg'}, {translateY:-100}]}}/>
    </View>
}

const URI = 'https://wallpaperaccess.com/full/2213424.jpg'
const IMAGE_SIZE = 200

const Review=()=><View style={styles.contentContainer}>
    <RowView>
        <Image source={{uri:'https://i.pinimg.com/originals/73/16/f5/7316f550de9ca0045e3d8d98a5bb5e44.png'}} style={{height:50, width:50, borderRadius:50}}/>
        <View style={{marginLeft:10}}>
            <Text>Shamrocks</Text>
            <Text><AntDesign name="star" size={15} color={color.active} /> 4.5</Text>
        </View>
    </RowView>
    <View>
        <Text size={12} style={{width:'100%'}} numberOfLines={2}>Awesome Service! I would like to recomm to you all.</Text>
    </View>
</View>

const Point = ({children, last=false, text})=><RowView style={{...styles.Points, borderBottomWidth:last ? 0:2}}>
    {children}
    <Text style={{marginLeft:10}}>{text}</Text>
</RowView>

const ServiceProfile = () => {
    return (
        <View style={{flex:1}}>
            <Background/>
            <View style={{height:HEIGHT*.05}}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding:20}}>
                    <Image source={{uri:URI}} style={styles.image}/>
                    <View style={styles.container}>
                        <View style={{alignSelf:'center', marginBottom:10}}>
                            <Text size={20} bold>Dhruv Aggarwal</Text>
                            <RowView style={{alignSelf: 'center',}}>
                                <MaterialIcons name="verified" size={24} color={color.blue} />
                                <Text> Electrician</Text>
                            </RowView>
                        </View>
                        <View style={{padding:10}}>
                            <RowView>
                                <View style={[styles.options, {borderRightWidth:2.5, borderRightColor:color.lightDark}]}>
                                    <Text size={20} bold>250m <MaterialCommunityIcons name="map-marker-distance" size={24} color={color.active}/></Text>
                                    <Text>away</Text>
                                </View>
                                <View style={styles.options}>
                                    <Text size={20} bold>4.5 <AntDesign name="star" size={24} color={color.active} /></Text>
                                    <Text>Rating</Text>
                                </View>
                            </RowView>
                        </View>
                    </View>
                    <Text size={12} style={{margin:10, marginBottom:-5}}>About</Text>
                    <View style={styles.contentContainer}>
                        <Point text='+91 8595771213'>
                            <Ionicons name="call" size={24} color={color.active} /> 
                        </Point>
                        <Point text='X-block 133/1 Gali No. 11 Delhi-110053'>
                            <Entypo name="address" size={24} color={color.active} />
                        </Point>
                        <Point last text={`Since ${moment().format('LL')}`}>
                            <Entypo name="flag" size={24} color={color.active}/>
                        </Point>
                    </View>
                    <View style={{marginTop:10}}>
                        <Text size={12} style={{margin:10, marginBottom:-5}}>Customer Reviews</Text>
                        <Review/>
                        <Review/>
                        <Review/>
                        <Review/>
                        <Review/>
                    </View>
                    <Text>{'\n'}</Text>
                    <Text>{'\n'}</Text>
                </View>
            </ScrollView>
            <View style={{position:'absolute',bottom:0, backgroundColor:color.active, width:'100%', alignItems:'center', padding:15}}>
                <Text size={20} bold>Accept</Text>
            </View>
        </View>
    )
}

export default ServiceProfile

const styles = StyleSheet.create({
    container:{
        backgroundColor:'rgba(34, 42, 56,0.8)',
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
        backgroundColor:'rgba(34, 42, 56,0.8)',
        marginTop:10,
        padding:10,
        borderRadius:20
    },
    Points:{
        borderBottomWidth:2,
        paddingVertical:10,
        marginHorizontal:10,
        borderBottomColor:color.lightDark
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
