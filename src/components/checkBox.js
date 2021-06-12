import React,{useState} from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 

import {RowView, Text} from 'styles'
import color from 'colors'

const ICON_SIZE = 30

const checkBox = ({data, setFilterList, active}) => {
    const [activeVal, setActive] = useState(active)
    const onPress = ()=>{
        setActive(!active); 
        !active && setFilterList(res=>[...res, data.value])
        active && setFilterList(res=>res.filter(item => item!==data.value))
    }
    return (
        <Pressable android_ripple={{color:color.dark}} onPress={onPress} style={{paddingVertical: 10, paddingHorizontal:20}}>
            <RowView style={{justifyContent: 'space-between',}}>
                <Text regular>{data.label}</Text>
                {
                    !active ? 
                    <MaterialCommunityIcons name="checkbox-blank-outline" size={ICON_SIZE} color={color.active} />
                    :
                    <Ionicons name="ios-checkbox" size={ICON_SIZE} color={color.active} />
                }
            </RowView>
        </Pressable>
    )
}

export default checkBox

const styles = StyleSheet.create({})
