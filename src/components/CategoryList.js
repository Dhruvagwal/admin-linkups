import React, { useState } from 'react'
import { StyleSheet, ScrollView, Pressable, Image } from 'react-native'

import ScreenModal from 'components/ScreenModal'
import {Text, RowView} from 'styles'
import color from 'colors'
import {updateProfile} from 'hooks/useData'

const CategoryList = ({category, Update})=>{

    const setCategory = async (id)=>{
        await updateProfile({category:id})
        await Update()
    }

    return <ScreenModal style={{flex:1}}>
        <Text>Select Your Category</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={{marginTop:20}}>
            {category.map((item)=><Pressable onPress={()=>setCategory(item.id)} key={item.id} style={styles.listView}>
                <RowView style={styles.containContainer}>
                    <Image source={{uri:item.url}} style={{height:90, width:90}}/>
                    <Text bold size={20}>{item.name}</Text>
                </RowView>
            </Pressable>
            )}
        </ScrollView>
    </ScreenModal>
}


export default CategoryList

const styles = StyleSheet.create({
    listView:{
        marginBottom:10,
        borderRadius:20,
        overflow:'hidden',
        height:100
    },
    containContainer:{
        width:'100%',
        height: '100%',
        justifyContent:'space-evenly',
        backgroundColor: color.lightDark,
    },
})
