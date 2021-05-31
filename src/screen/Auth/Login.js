import React, { useState } from 'react'
import { View, Pressable } from 'react-native'

import {Text} from 'styles'
import color from 'colors'
import TextInput from 'components/TextInput'
import {signInWithPhoneNumber, signUpWithPhoneNumber} from 'hooks/useAuth'
import OTPScreen from './OTPScreen'
const AUTH = ['LOGIN', 'SIGNUP']
const Login = () => {
    const [PhoneNumber, setPhoneNumber] = useState('')
    const [type, setType] = useState(AUTH[0])
    const [otp,setOTP] = useState('')
    const [otpScreen, setOTPScreen] = useState(false)

    if(!otpScreen){
        const otpSend = ()=>{
            setOTPScreen(true)
            // type === AUTH[0] ? signInWithPhoneNumber(PhoneNumber) : signUpWithPhoneNumber(PhoneNumber)
        }
        PhoneNumber.length === 10 && otpSend()

    }

    return (
        !otpScreen ? <View style={{paddingTop:25, padding:20, flex:1}}>
                <View style={{marginBottom:100, marginTop:50}}>
                    {type===AUTH[0]?<>
                        <Text size={25} bold>Welcome,</Text>
                        <Text size={18}>Sign in to continue!</Text>
                    </>:
                    <>
                        <Text size={25} bold>Create Account,</Text>
                        <Text size={18}>Sign up to get started!</Text>
                    </>}
                </View>    
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <TextInput label='Phone Number' setValue={setPhoneNumber} keyboardType='number-pad'/>
                    <Pressable onPress={()=>setType(type===AUTH[0] ? AUTH[1] : AUTH[0])} style={{position:'absolute', bottom:20, alignSelf:'center'}}>
                        {type===AUTH[0]?<Text>I'm new Here. <Text style={{color:color.active}} regular>Sign Up</Text></Text>
                        :<Text>I'm already a member. <Text style={{color:color.active}} regular>Sign In</Text></Text>
                        }
                    </Pressable>
                </View>
            </View>:
            <OTPScreen PhoneNumber={PhoneNumber} type={type} setOTP={setOTP} setPhoneNumber={setPhoneNumber} setOTPScreen={setOTPScreen}/>
        
    )
}

export default Login

