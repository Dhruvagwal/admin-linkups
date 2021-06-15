import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Image, Pressable, TextInput, BackHandler, KeyboardAvoidingView} from 'react-native'
import { MaterialIcons, Entypo, AntDesign, Feather } from '@expo/vector-icons';

import ImagePicker from 'components/ImagePicker'

import {Text, RowView} from 'styles'
import color from 'colors'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import useKeyboard from 'hooks/useKeyboard'
import { stat } from 'react-native-fs';
import {saveOrder, Message} from 'hooks/useData'
import { Snackbar } from 'react-native-paper';
import {DataConsumer} from 'context/data'
import { sendPushNotification } from 'middlewares/notification'
import storage from '@react-native-firebase/storage'

var chunk = require('lodash.chunk');
const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width


const getFileSize = async (uri) => {
    const {size} = await stat(uri);
    const extension =  uri.slice(uri.length-3,uri.length)
    return {size, extension}
};

const Problem = ({setSuccess,setLoading,state, subCategory, data}) =>{
    const [text, setText] = useState('')
    const [response, setResponse] = useState(state.url)
    const [fileData, setfileData] = useState()
    const {state:{profile}} = DataConsumer()
    const _onPress =async ()=>{
        setLoading(true)
        const id = 'ORD-'+Math.floor(Math.random()*1000000)
        var url
        if(response){
            await storage().ref(`orderImage/${id}`).putFile(response);
            url = await storage().ref(`orderImage/${id}`).getDownloadURL();
        }
        const DATA = {
            type:'service',
            user:profile.id,
            info:{...state, problem:text},
            status:'posted',
            coord:profile.coord,
            Address:profile.Address,
            postedAt: new Date(),
            id,
            url
        }
        await saveOrder(DATA)

        const notifyDataFeed = {
            title:`Got An New Feed`,
            body:`${profile.name} give the proposal first hurry up!!`,
            data:{id}
        }
        data.map(({token, id})=>{
            sendPushNotification(token, notifyDataFeed)
            Message({phone:'+'+id, message:`${profile.name} give the proposal first hurry up!!`,})
        })
        setSuccess(true)
        setTimeout(()=>{setSuccess(false);RootNavigation.navigate(CONSTANT.Library,{load:true})}, 2500)
        setLoading(false)
    }
    const active = useKeyboard()
    response && getFileSize(response).then(data=>!fileData && setfileData(data))
    var reason = subCategory.problem? subCategory.problem : subCategory.reason
    reason = chunk(reason,2)
    return <View style={{padding:20, flex:1}}>
        {!active && <>
        {
            subCategory.problem?
            <Text size={13} regular>Problem Face</Text>
            :
            <Text size={13} regular>For</Text>
        }
        {
            reason.map(res=>
                <RowView>                    
                    {res.map(item=><Pressable onPress={()=>setText(item)} key={Math.random()} style={[styles.contentContainer, {padding:20, justifyContent:'center', flexGrow:1, marginRight:5},item===text&&{backgroundColor: color.blue,elevation:5}]}>
                        <Text regular>{item}</Text>
                    </Pressable>)}
                </RowView>
            )
        }
        </>}
        <View style={[styles.contentContainer, {justifyContent:'center'}]} android_ripple={{color:color.dark}}>
                <TextInput
                    placeholder='Edit'
                    value={text}
                    onChangeText={setText}
                    placeholderTextColor={color.white}
                    style={{
                        fontFamily:'Montserrat-Regular',
                        textAlign:'center',
                        flexGrow:1,
                        fontSize:15,
                        color:color.white,
                        marginRight:5
                    }}
                    multiline
                />
        </View>
        {!active && <ImagePicker setResponse={setResponse} setLoading={()=>{}} style={{marginTop:20, overflow: 'hidden', borderRadius:10}} uploadImage={false}>
            {!response ? <View style={{width:WIDTH-40, height:130, borderWidth:2, borderColor:color.blue, borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                <Entypo name="image" size={30} color={color.blue} />
                <Text regular size={13} >Upload Image (Optional)</Text>
            </View>
            :
            <Image resizeMode='center' style={{width:WIDTH-40, height:130}} source={{uri:response}} />
            }
        </ImagePicker>}
        {text.length>0 &&
            <Pressable onPress={()=>_onPress()} style={styles.button}>
                <Text regular>Submit</Text>
            </Pressable>
        }
        <Snackbar onDismiss={()=>{}} style={styles.Snackbar} visible={fileData && fileData.size/(1024*1024)>10}>
            <Text regular>File size must be less than 10mb</Text>
        </Snackbar>
        <Snackbar onDismiss={()=>{}} style={styles.Snackbar} visible={fileData && fileData.extension!=='jpg' && 'png'}>
            <Text regular>Should support .png or .jpg format</Text>
        </Snackbar>
    </View>
}

export default Problem


const styles = StyleSheet.create({
    Button:{
        backgroundColor: color.active,
        position:'absolute',
        bottom:0,
        padding: 20,
        width:WIDTH,
        alignItems:'center',
        justifyContent:'center'
    },
    contentContainer:{
        backgroundColor: 'rgba(34, 42, 56,0.8)',
        marginVertical:10,
        padding:10,
        flexDirection:'row',
        alignItems:'center',
        borderRadius:10
    },
    button:{
        backgroundColor:color.active,
        alignItems:'center',
        alignSelf:'center',
        borderRadius:10,
        marginTop:20,
        position: 'absolute',
        bottom:0,
        margin:20,
        elevation:5,
        width:WIDTH/2,
        paddingVertical:15
    },
    Snackbar:{
        backgroundColor:color.lightDark,
    }
})
