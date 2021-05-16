import React from 'react'
import { StyleSheet, View, Image } from 'react-native'

import LottieView from 'lottie-react-native'

import {Text} from 'styles'
import color from 'colors'

const Loading = () => {
    return (
        <View style={{flex:1, justifyContent:'center'}}>
            <LottieView
                source={require('../../assets/lottieFiles/loading.json')}
                style={{width:'50%', height:'50%', alignSelf:'center'}}
                autoPlay
            />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({})
