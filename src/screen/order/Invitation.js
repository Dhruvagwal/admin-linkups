import React,{useState} from 'react'
import { Dimensions, StyleSheet, View, Image, ScrollView, Pressable } from 'react-native'

import { AntDesign, MaterialCommunityIcons, Ionicons, Entypo, SimpleLineIcons, MaterialIcons} from '@expo/vector-icons'; 
import LottieView from 'lottie-react-native'

import {Text, RowView} from 'styles'
import color from 'colors'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const URI = 'https://wallpaperaccess.com/full/2213424.jpg'
const IMAGE_SIZE = 110
const InvitationService = ({pressed, setPressed})=><RowView style={styles.container}>
    <Image source={{uri:URI}} style={{height:IMAGE_SIZE, width:IMAGE_SIZE, borderRadius:20}}/>
    <View style={{marginLeft:10, width:'63%', overflow:'hidden'}}>
        <RowView>
            <MaterialIcons name="verified" size={24} color={color.blue} />
            <Text style={{width:WIDTH/2.3, marginLeft:5}} numberOfLines={1} size={18} bold>Dhruv aggarwal</Text>
        </RowView>
        <RowView>
            <Entypo name="address" size={24} color={color.active} />
            <Text style={{paddingVertical:5}}> 2.5m away</Text>
        </RowView>
        {
            !pressed ? <Pressable onPress={()=>setPressed(true)} style={{backgroundColor:color.active, padding:5, borderRadius:10, alignItems:'center'}}>
                <Text bold>Send Invite</Text>
            </Pressable> : <Pressable onPress={()=>setPressed(false)} style={{backgroundColor:color.red, padding:5, borderRadius:10, alignItems:'center'}}>
                <Text bold>Cancel</Text>
            </Pressable>
        }
    </View>
</RowView>

const Invitation = () => {
    const [pressed, setPressed] = useState(false)
    const [loading, setLoading] = useState(false)
    const Save=()=>{
        setLoading(true)
        setInterval(()=>{setLoading(false)}, 3000)
    }
    return (
        <View style={{flex:1}}>
           {!loading ? <>
                <View style={{height:HEIGHT*.05}}/>
                <View style={{margin:20}}>
                    <Text size={30} bold>Linkups</Text>
                    <Text>Post Order</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{margin:20, marginTop:0}}>
                        <Text>Send Invitations</Text>
                        <InvitationService pressed={pressed} setPressed={setPressed}/>
                    </View>
                </ScrollView>
                <Pressable onPress={Save} style={{position:'absolute', bottom:0, width:WIDTH, alignItems:'center', backgroundColor:color.active, padding:20}}>
                    <Text regular>Submit</Text>                
                </Pressable>
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
        borderRadius:20,
        padding:10,
        marginTop:10
    },
    loading:{
        width:WIDTH,
        height:HEIGHT,
        alignSelf:'center',
    }
})
