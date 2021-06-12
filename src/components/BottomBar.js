import React from 'react'
import { StyleSheet, View, Pressable  } from 'react-native'
import { Entypo, Ionicons, Feather } from '@expo/vector-icons'; 

import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {DataConsumer} from 'context/data'
import {Text} from 'styles'
import color from 'colors'

const BottomBar = () => {
    const {state:{currentRouteName}} = DataConsumer()
    return (
        <View style={styles.container}>
            <Pressable android_ripple={{color:color.active}} onPress={()=>RootNavigation.navigate(CONSTANT.Home)} style={styles.option}>
                <Entypo name="home" size={30} color={CONSTANT.Home === currentRouteName ? color.active : color.inActive} />
            </Pressable>
            <Pressable android_ripple={{color:color.active}} onPress={()=>RootNavigation.navigate(CONSTANT.Library)} style={styles.option}>
                <Ionicons name="library" size={24} color={CONSTANT.Library === currentRouteName ? color.active : color.inActive} />
            </Pressable>
            <Pressable android_ripple={{color:color.active}} onPress={()=>RootNavigation.navigate(CONSTANT.Setting)} style={styles.option}>
                <Feather name="menu" size={24} color={CONSTANT.Setting === currentRouteName ? color.active : color.inActive} />
            </Pressable>
        </View>
    )
}

export default BottomBar

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'rgba(26, 34, 47,0.8)',
        position: 'absolute',
        bottom:0,
        width:'100%',
        height:70,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'flex-end',
    },
    option:{
        flexDirection:'row',
        alignItems:'center',
        padding:20
    }
})
