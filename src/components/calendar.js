import React, {useState} from 'react'
import { StyleSheet, View, ScrollView, Pressable } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'

const Day = ({children, setActive, active=false})=>{
    return <Pressable onPress={()=>setActive(children)} style={[styles.tag, active&&styles.activeTag]}>
        <Text size={13} regular>{children}</Text>
    </Pressable>
}

const calendar = ({date, setDate, time, setTime}) => {
    const DayDate = new Date().getUTCDate()
    const month = new Date().getUTCMonth()
    const year = new Date().getFullYear()

    const currentDate = (inc=0) => `${DayDate>10?DayDate+inc:'0'+DayDate+inc}/${month>10?month:'0'+month}/${year}`
    
    const timeList=['9:00Am to 12:00Pm', '12:00Pm to 3:00Pm', '3:00pm to 6:00Pm', '6:00pm to 9:00Pm']
    const dateList = [currentDate(), currentDate(1), currentDate(2)]
    
    return <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal >
            {
                dateList.map(item=><Day key={item} active={item===date} setActive={setDate} >{item}</Day>)
            }
        </ScrollView>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal >
            {
                timeList.map(item=><Day key={item} active={item===time} setActive={setTime} >{item}</Day>)
            }
        </ScrollView>
    </View>
}

export default calendar

const styles = StyleSheet.create({
    container:{
        color:color.white,
        width:'100%',
    },
    tag:{
        backgroundColor:color.lightDark,
        padding:10,
        marginVertical:10,
        marginLeft:10,
        borderRadius:10
    },
    activeTag:{
        backgroundColor:color.active
    }

})
