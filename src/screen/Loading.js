import React from 'react'
import { StyleSheet, View, Image } from 'react-native'

import {Text} from 'styles'
import color from 'colors'

const Loading = () => {
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center',backgroundColor:color.dark}}>
            <Image source={require('../../assets/loading.gif')} style={{height:200, width:200}}/>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({})
