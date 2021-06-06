import React from 'react'
import { StyleSheet, View, Pressable,Dimensions, AsyncStorage } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'


const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height
const Language = () => {
    const Languages = ['English', 'Hindi']
    const setLanguage =async (item)=>{
        await AsyncStorage.setItem('LANGUAGE',item )
        const lan = await AsyncStorage.getItem('LANGUAGE')
        console.log(lan)
    }
    return (
        <View style={styles.container}>
            {
                Languages.map(item=><Pressable onPress={()=>setLanguage(item)} key={item} style={styles.category}>
                    <Text size={30} regular>{item}</Text>
                </Pressable>)
            }
        </View>
    )
}

export default Language

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems:'center',
        justifyContent:"center"
    },
    category:{
        backgroundColor: color.elevatedDark,
        width:WIDTH/1.1,
        height:150,
        marginVertical:10,
        borderRadius:20,
        padding:20,
        alignItems:'center',
        justifyContent:'center'
    }
})
