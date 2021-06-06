import React, { useState } from 'react'
import { View, Pressable } from 'react-native'

import {Text} from 'styles'
import color from 'colors'
import TextInput from 'components/TextInput'
import {signInWithPhoneNumber, signUpWithPhoneNumber} from 'hooks/useAuth'
import {getDataById} from 'hooks/useData'
import countryCode from 'data/countryCode'
import OTPScreen from './OTPScreen'
const AUTH = ['LOGIN', 'SIGNUP']
const Login = () => {
    const [PhoneNumber, setPhoneNumber] = useState('')
    const [type, setType] = useState(AUTH[1])
    const [otpScreen, setOTPScreen] = useState(false)

    if(!otpScreen){
        const otpSend = ()=>{
            setOTPScreen(true)
            signUpWithPhoneNumber(PhoneNumber).then(async res => {
                    if(!res){
                        await signInWithPhoneNumber(PhoneNumber)
                        const code = await countryCode()
                        const id = code.replace('+','')+PhoneNumber
                        const response = await getDataById('serviceProvider',id)
                        response.data!=='' && setType(AUTH[0])
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
                    <Text size={18}>To Linkups Seller App!</Text>
                </View>    
                <View style={{flex:1, justifyContent:'flex-start'}}>
                    <TextInput label='Phone Number' setValue={setPhoneNumber} keyboardType='number-pad'/>
                </View>
            </View>:
            <OTPScreen PhoneNumber={PhoneNumber} type={type} setPhoneNumber={setPhoneNumber} setOTPScreen={setOTPScreen}/>
        
    )
}

export default Login

