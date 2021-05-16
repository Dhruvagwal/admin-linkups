import React, {useState} from 'react'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'

import { AntDesign } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'

import { Hoshi } from 'react-native-textinput-effects';

const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height

const Login = () => {
    const [login, setLogin] = useState(false)
    const pressChange = ()=>{
        setLogin(!login)
    }
    return (
        <View style={styles.LoginContainer}>
            <View style={{padding:20}}>
                <Hoshi
                    label={'Phone Number'}
                    // this is used as active border color
                    borderColor={color.active}
                    // active border height
                    borderHeight={5}
                    inputPadding={20}
                    keyboardType='number-pad'
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={color.lightDark}
                />
                <Pressable onPress={pressChange}>
                    <Text regular style={{color:color.active, alignSelf: 'flex-end',marginTop:10}} size={12}>
                        {!login?'Have An Account? Login':'Create Account'}
                    </Text>
                </Pressable>
            </View>

            <Pressable style={{backgroundColor:color.blue, height:70, justifyContent:'center', alignItems:'center', position:'absolute', bottom:0, width:WIDTH}}>
                <RowView>
                    <AntDesign name="login" size={24} color={color.white} />
                    <Text regular> {!login?'Create':'Login'}</Text>
                </RowView>
            </Pressable>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    LoginContainer:{
        position:'absolute',
        bottom:0,
        backgroundColor:color.lightDark,
        width:WIDTH,
        height:HEIGHT*.3,
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        paddingTop: 20,
    }
})
