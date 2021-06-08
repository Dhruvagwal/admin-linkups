import React, { useState, useEffect } from 'react'
import { View, Pressable, StyleSheet, AsyncStorage } from 'react-native'

import {Text} from 'styles'
import color from 'colors'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import TextInput from 'components/TextInput'
import {signInWithPhoneNumber, signUpWithPhoneNumber} from 'hooks/useAuth'
import {getDataById} from 'hooks/useData'
import countryCode from 'data/countryCode'
import OTPScreen from './OTPScreen'
const STORAGE_KEY_3 = 'LINKUPS_ADMIN_PHONE_NUMBER' 

const AUTH = ['LOGIN', 'SIGNUP']
const LINKUPS_STATE = 'LINKUPS_ADMIN_STATE'
const Login = () => {
    const [PhoneNumber, setPhoneNumber] = useState('')
    const [type, setType] = useState(AUTH[1])
    const [otpScreen, setOTPScreen] = useState(false)
    useEffect(() => {
        AsyncStorage.getItem(LINKUPS_STATE).then(async res=>{
            const number = await AsyncStorage.getItem(STORAGE_KEY_3)
            if(res==='OTP'){
                setOTPScreen(true)
                setPhoneNumber(number)
                await AsyncStorage.setItem(LINKUPS_STATE,'NONE' )
            }
            else if(res==='NEXT'){
                RootNavigation.navigate(CONSTANT.SignUp, {number})
                await AsyncStorage.setItem(LINKUPS_STATE,'NONE' )
            }
        })
    }, [])
    if(!otpScreen){
        const otpSend = async ()=>{
            await AsyncStorage.setItem(LINKUPS_STATE,'OTP' )
            await AsyncStorage.setItem(STORAGE_KEY_3,PhoneNumber)
            setOTPScreen(true)
            signUpWithPhoneNumber(PhoneNumber).then(async res => {
                    if(!res){
                        await signInWithPhoneNumber(PhoneNumber)
                        const code = await countryCode()
                        const id = code.replace('+','')+PhoneNumber
                        const response = await getDataById('serviceProvider',id)
                        response.data!=='' && setType(AUTH[0])
                    }else{
                        setType(AUTH[1])
                    }
                }
            )
            }
        PhoneNumber.length === 10 && otpSend()

    }

    return (
        !otpScreen ? <View style={{paddingTop:25, padding:20, flex:1}}>
                <View style={{marginBottom:100, marginTop:50}}>
                    <Text size={25} bold>Welcome,</Text>
                    <Text size={18}>To Linkups!</Text>
                </View>    
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <TextInput value={PhoneNumber} label='Phone Number' setValue={setPhoneNumber} keyboardType='number-pad'/>
                </View>
            </View>:
            <OTPScreen PhoneNumber={PhoneNumber} type={type} setPhoneNumber={setPhoneNumber} setOTPScreen={setOTPScreen}/>
        
    )
}

export default Login

const styles = StyleSheet.create({
    borderStyleBase: {
      width: 30,
      height: 45
    },
  
    borderStyleHighLighted: {
      borderColor:color.active,
    },
  
    underlineStyleBase: {
      width: 25,
      height: 45,
      borderWidth: 0,
      borderBottomWidth: 2,
      marginLeft:5
    },
  
    underlineStyleHighLighted: {
      borderColor: color.active,
    },
  });

