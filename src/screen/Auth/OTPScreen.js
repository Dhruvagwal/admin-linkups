import React, {useState, useEffect} from 'react'
import { StyleSheet, View, BackHandler } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'
import TextInput from 'components/TextInput'
import Loading from 'components/Loading'
import { Pressable } from 'react-native'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {confirmOTP, signInWithPhoneNumber} from 'hooks/useAuth'
import {AuthConsumer} from 'context/auth'

const OTPScreen = ({setPhoneNumber=()=>{}, setOTPScreen=()=>{}, type='LOGIN',PhoneNumber=''}) => {
    const [time, setTime] = useState(60)
    const {setAuth} = AuthConsumer()
    const [otp,setOTP] = useState('')
    const [loading, setLoading] = useState(false)
    setTimeout(()=>{time>0 && setTime(time-1)},1000)
    useEffect(() => {
        const backAction = () => {
            setPhoneNumber('')
            setOTPScreen(false)
            return true
        };
      
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [])

    const confirm = async ()=>{
        setLoading(true)
        const result = await confirmOTP(PhoneNumber,otp )
        if (result){
            (type === 'SIGNUP')? RootNavigation.navigate(CONSTANT.SignUp, {PhoneNumber}) : setAuth(true)
        }else{
            setPhoneNumber('')
            setOTPScreen(false)
        }
        setLoading(false)
    }
    return (
            <View style={{paddingTop:25, padding:20, flex:1}}>
                <View style={{marginBottom:100, marginTop:50}}>
                    <Text size={25} bold>OTP,</Text>
                    <Text>(One Time Password)</Text>
                </View>    
                <View style={{flex:.5, justifyContent:'flex-start'}}>
                    <TextInput label='Enter OTP' setValue={setOTP} keyboardType='number-pad'/>
                    <RowView style={{justifyContent:'space-between', marginTop:10}}>
                        <Text>00:{time>10 ? time : `0${time}`}</Text>
                        <Pressable disabled={time!==0} android_ripple={{color:color.lightDark}} onPress={()=>{signInWithPhoneNumber(PhoneNumber), setTime(60)}}>
                            <Text>Resend OTP?</Text>
                        </Pressable>
                    </RowView>
                    {
                    !loading ? <Pressable onPress={confirm} style={styles.confirm}>
                        <Text size={20} regular>Confirm</Text>
                    </Pressable>
                    :
                    <Loading whole={false} />
                    }
                </View>
                
            </View>
    )
}

export default OTPScreen

const styles = StyleSheet.create({
    confirm:{
        backgroundColor:color.active,
        padding:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginTop:50
    }
})
