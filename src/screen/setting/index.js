import React,{useState, useEffect} from 'react'
import { MaterialCommunityIcons, MaterialIcons, Entypo, AntDesign, FontAwesome, Foundation, Feather } from '@expo/vector-icons'; 
import { StyleSheet, View, Dimensions, Pressable, Image, Linking, BackHandler, TextInput, KeyboardAvoidingView } from 'react-native'

import {AuthConsumer} from 'context/auth'
import {DataConsumer} from 'context/data'
import axios from 'axios'

import {Logout} from 'hooks/useAuth'
import {getDataById, updateUserProfile} from 'hooks/useData'
import CONSTANT from 'navigation/navigationConstant.json'
import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading'
import BottomBar from 'components/BottomBar';
import ImageViewer from 'components/ImageViewer';
import ImagePicker from 'components/ImagePicker'
import useKeyboard from 'hooks/useKeyboard'

const HEIGHT =Dimensions.get('screen').height
const WIDTH =Dimensions.get('screen').width

const BackGround = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1550, width:'100%',transform:[{rotate:'36deg'}]}}/>
    </View>
}


const IMAGE_SIZE = 150

const Options=({children})=>{
    return <RowView style={{justifyContent:'space-between'}}>
                <RowView>
                    {children}
                </RowView>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={color.white} />
            </RowView>
    }

    
    
const Index = ({navigation}) => {
    const {setAuth} = AuthConsumer()
    const {state:{profile}, Update} = DataConsumer()
    const [showImage, setShowImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState()
    const [isEdit, setisEdit] = useState(false)

    const LOGOUT = async ()=>{
        await setAuth(false)
        Logout()
    }
    const SellerApp = ()=>{
        Linking.openURL('Linkups://app').catch(()=>Linking.openURL("market://details?id=com.whatsapp"));
    }
    const isOpen = useKeyboard()
    const _setName = async ()=>{
        setLoading(true)
        await updateUserProfile({name})
        setisEdit(false)
        setLoading(false)
        Update()
    }
    return (
        !showImage ? <View style={{flex:1}}>
            <BackGround/>
            <View style={{height:HEIGHT*.02}}/>
            {!loading ?<View style={{padding:20,flex:1}}>
                <RowView style={{justifyContent:'space-between', alignItems:'flex-start'}}>
                    <View>
                        <Text bold size={20}>Linkups</Text>
                        <Text size={13}>Profile</Text>
                    </View>
                </RowView>
                <View style={{alignItems:'center', alignSelf:'center'}}>
                    <Pressable onPress={()=>setShowImage(true)}>
                        <Image source={{uri:profile.url}} style={{height:IMAGE_SIZE, width:IMAGE_SIZE, borderRadius:IMAGE_SIZE}}/>
                    </Pressable>
                    <ImagePicker Update={Update} setLoading={setLoading} id={profile.id} style={styles.camera}>
                        <Feather name="camera" size={24} color={color.white} />
                    </ImagePicker>
                </View>
                <View style={{flex:.85, marginTop:20}}>
                    <RowView style={{alignItems:'center',justifyContent:'center'}}>
                        <TextInput
                            value={name===undefined?profile.name:name}
                            style={styles.TextInput}
                            onChangeText={setName}
                            placeholder='Name Here'
                            placeholderTextColor={color.inActive}
                            editable={isEdit}
                        />
                    </RowView>
                    <Text style={{alignSelf:'center'}} regular>+91 {profile.id && profile.id.replace('91','')}</Text>
                    {!isOpen && <View style={{flex:.8, justifyContent:'center'}}>
                        <Pressable style={{padding:15}} android_ripple={{color:color.dark}} onPress={()=>navigation.navigate(CONSTANT.Address)}>
                            <Options>
                                <Text regular>My Address</Text>
                            </Options>
                        </Pressable>

                        <Pressable style={{padding:15}} onPress={SellerApp} android_ripple={{color:color.dark}}>
                            <Options>
                                <Text regular>Linkups Provider</Text>
                            </Options>
                        </Pressable>

                        <Pressable style={{padding:15}} onPress={()=>navigation.navigate(CONSTANT.Help)} android_ripple={{color:color.dark}}>
                            <Options>
                                <Text regular>Help & Support</Text>
                            </Options>
                        </Pressable>

                        <Pressable style={{padding:15}} android_ripple={{color:color.dark}} onPress={LOGOUT}>
                            <Options>
                                <Text style={{color:color.red}} regular>Logout</Text>
                            </Options>
                        </Pressable>
                    </View>}
                </View>
            </View>:<Loading/>}
            {isOpen && <KeyboardAvoidingView keyboardVerticalOffset={50}>
                <Pressable onPress={_setName}  style={styles.button}>
                    <Text bold>Submit</Text>
                </Pressable>
            </KeyboardAvoidingView>}
            {!isOpen && <BottomBar/>}
        </View>:
        <ImageViewer uri={profile.url} showImage={showImage} setShowImage={setShowImage}/>
    )
}

export default Index

const styles = StyleSheet.create({
    camera:{
        backgroundColor: color.active,
        padding:10,
        position:'absolute',
        bottom:-10,
        right:10,
        borderRadius:100
    },
    TextInput:{
        marginRight:5, 
        alignSelf:'center', 
        fontSize:20, 
        color:color.white,
        fontFamily:'Montserrat-Bold',
        padding:5,
        textAlign:'center'
    },
    button:{
        backgroundColor:color.active,
        padding:10,
        alignItems:'center',
    }
})
