import React, {useState} from 'react'
import { Dimensions, Pressable, StyleSheet, View, Modal, StatusBar, TextInput} from 'react-native'
import { AntDesign } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import {signInWithPhoneNumber, confirmOTP, createUser} from 'hooks/useAuth'
import {AuthConsumer} from 'context/auth'

const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height

const OTPScreen = ({setOTP, setResend})=>{
    const [time, setTime] = useState(60)
    setTimeout(()=>{time>0 && setTime(time-1)},1000)
    const resend = ()=>{
        if(time===0){
            setTime(60); 
            setResend(true)
        }      
    }
    return <>
        <Text size={20} style={{marginBottom:10}} regular>OTP</Text>
        <TextInput
            style={styles.TextInput}
            placeholder='Enter OTP'
            placeholderTextColor={color.inActive}
            onChangeText={setOTP}
            keyboardType='number-pad'
        />
        <RowView style={{justifyContent:'space-between'}}>
            <Text size={12}>00:{time}</Text>
            <Pressable onPress={resend}>
                <Text size={12} style={{margin:5}}>Resend OTP</Text>
            </Pressable>
        </RowView>
    </>
}

const Login = () => {
    const [login, setLogin] = useState(false)
    const [phone, setPhone] = useState('')
    const [extend, setExtend] = useState(false) 
    const [name, setName] = useState('')
    const [Resend, setResend] = useState(false)
    const [AddressScreen, setAddressScreen] = useState(false)
    const [Address, setAddress] = useState('')
    const [OTP, setOTP] = useState(false)
    const {setAuth} = AuthConsumer()

    const pressChange = ()=>{
        setLogin(!login)
    }

    Resend && signInWithPhoneNumber(phone)

    const auth =async ()=>{
        if(!OTP){
            phone.length === 10 ? setOTP(true) : alert('Please Enter Correct Number')
            await signInWithPhoneNumber(phone)
                .then(response=> !response && setLogin(response))
                .catch(err=>setLogin(false))
        }else{
            const result = await confirmOTP(phone, OTP)
            if(result){
                if(login){
                    setAuth(true)
                    setOTP(false)  
                }else{
                    setExtend(true)
                }
            }
        }
    }

    const create = ()=>{
        !Address ? setAddressScreen(true) : (
            createUser(phone,name, Address),
            setAuth(true)
        )
    }

    return (
        <Modal transparent>
            <StatusBar translucent backgroundColor='rgba(0,0,0,0.5)'/>
            <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)'}}>
                <View style={styles.LoginContainer}>
                    <View style={{padding:20}}>       
                    {
                        !extend ?
                        <>
                            {
                            !OTP? 
                                <>
                                    <Text size={20} style={{marginBottom:10}} regular>{login ? 'Welcome Back !' : 'Sign Up'}</Text>
                                    <TextInput
                                        placeholder='Phone Number'
                                        style={styles.TextInput}
                                        placeholderTextColor={color.inActive}
                                        keyboardType='number-pad'
                                        onChangeText={setPhone}
                                        value={phone}
                                    />
                                    <Pressable onPress={pressChange}>
                                        <Text regular style={{color:color.active, alignSelf: 'flex-end',marginTop:10}} size={12}>
                                            {!login?'Have An Account? Login':'Create Account'}
                                        </Text>
                                    </Pressable>
                                </>
                                :
                                <OTPScreen setOTP={setOTP} setResend={setResend}/>
                            }
                        </>
                        :
                        <>
                            {
                                !AddressScreen ?
                                    <TextInput
                                        placeholder='Name'
                                        style={styles.TextInput}
                                        placeholderTextColor={color.inActive}
                                        onChangeText={setName}
                                        value={name}
                                    />
                                :
                                    <TextInput
                                        placeholder='Address'
                                        style={styles.TextInput}
                                        placeholderTextColor={color.inActive}
                                        onChangeText={setAddress}
                                        value={Address}
                                    />
                            }
                        </>

                    }         
                    </View>
                </View>
            </View>
            <Pressable onPress = {()=>{!extend ? auth() : create() }} style={{backgroundColor:color.blue, height:70, justifyContent:'center', alignItems:'center', position:'absolute', bottom:0, width:WIDTH}}>
                <RowView>
                    <AntDesign name="login" size={24} color={color.white} />
                    <Text regular> {!login?'Create':'Login'}</Text>
                </RowView>
            </Pressable>
        </Modal>
    )
}

export default Login

const styles = StyleSheet.create({
    LoginContainer:{
        position:'absolute',
        bottom:70,
        backgroundColor:color.lightDark,
        width:WIDTH,
        height:HEIGHT*.25,
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        justifyContent:'center'
    },
    TextInput:{
        paddingVertical: 10,
        fontSize:20,
        letterSpacing:2,
        color:color.white,
        fontFamily:'Montserrat-Regular',
        borderBottomWidth:4,
        borderBottomColor:color.active,
    }
})
