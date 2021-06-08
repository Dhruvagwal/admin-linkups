import React, {useState, useEffect} from 'react'
import { StyleSheet, View, BackHandler } from 'react-native'
import OTPInputView from '@twotalltotems/react-native-otp-input'

import {Text, RowView} from 'styles'
import color from 'colors'
import TextInput from 'components/TextInput'
import Loading from 'components/Loading'
import { Pressable, AsyncStorage } from 'react-native'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {confirmOTP, signInWithPhoneNumber} from 'hooks/useAuth'
import {AuthConsumer} from 'context/auth'
const LINKUPS_STATE = 'LINKUPS_ADMIN_STATE'
const OTPScreen = ({setPhoneNumber=()=>{}, setOTPScreen=()=>{}, type='LOGIN',PhoneNumber=''}) => {
    const [time, setTime] = useState(60)
    const {setAuth} = AuthConsumer()
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

    const confirm = async (otp)=>{
        setLoading(true)
        const result = await confirmOTP(PhoneNumber,otp, type !== 'SIGNUP')
        if (result){
            if(type === 'SIGNUP'){
                await AsyncStorage.setItem(LINKUPS_STATE,'NEXT') 
                RootNavigation.navigate(CONSTANT.SignUp, {PhoneNumber})
            }
            else{
                setAuth(true)
            } 
        }else{
            console.log('trigger')
            setPhoneNumber('')
            setOTPScreen(false)
            await AsyncStorage.setItem(LINKUPS_STATE,'NONE')
        }
        setLoading(false)
    }
    return (
            <View style={{paddingTop:25, padding:20, flex:1}}>
                <View style={{marginBottom:100, marginTop:50}}>
                    <Text size={25} bold>OTP,</Text>
                    <Text regular>+91{PhoneNumber}</Text>
                </View>    
                <View style={{flex:.5, justifyContent:'flex-start'}}>
                <OTPInputView
                    style={{width: '100%', height: 50, alignSelf:'center'}}
                    pinCount={6}
                    autoFocusOnLoad
                    editable={!loading}
                    secureTextEntry
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled = {confirm}
                />
                    {/* <TextInput label='Enter OTP' setValue={setOTP} keyboardType='number-pad'/> */}
                    <RowView style={{justifyContent:'space-between', marginTop:10}}>
                        <Text>00:{time>10 ? time : `0${time}`}</Text>
                        <Pressable disabled={time!==0} android_ripple={{color:color.lightDark}} onPress={()=>{signInWithPhoneNumber(PhoneNumber), setTime(60)}}>
                            <Text>Resend OTP?</Text>
                        </Pressable>
                    </RowView>
                    {
                    loading &&
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
    },
    borderStyleBase: {
        width: 30,
        height: 45
      },
    
      borderStyleHighLighted: {
        borderColor: color.active,
      },
    
      underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        fontSize:20,
        fontFamily:'Montserrat-Bold',
        borderBottomWidth: 2,
      },
    
      underlineStyleHighLighted: {
        borderColor: color.active,
      },    
})
