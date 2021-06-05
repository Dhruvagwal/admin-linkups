import React, {useState} from 'react'
import { StyleSheet, View, ScrollView, Pressable } from 'react-native'
import moment from 'moment'

import {Text, RowView} from 'styles'
import color from 'colors'

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const Day = ({children, setActive, active=false})=>{
    return <Pressable onPress={()=>setActive(`${children[0]}/${children[1]}/${children[2]}`)} style={[styles.tag, active&&styles.activeTag]}>
        <Text bold>{children[0]} {monthNames[children[1]]}</Text>
        <Text size={15} regular>{children[2]}</Text>
    </Pressable>
}
const Time = ({children, setActive, active=false})=>{
    return <Pressable onPress={()=>setActive(children)} style={[styles.tag, active&&styles.activeTag]}>
        <Text size={13} regular>{children}</Text>
    </Pressable>
}

const calendar = ({date, setDate, time, setTime}) => {
    const getDate = (inc=0)=>moment().add(inc,'days').format('DD-MM-YYYY')
    const currentDate = (inc=0) => [parseInt(getDate(inc).slice(0,2)),parseInt(getDate(inc).slice(3,5)),getDate(inc).slice(6,10)]
    
    const timeList=['9:00Am to 12:00Pm', '12:00Pm to 3:00Pm', '3:00pm to 6:00Pm', '6:00pm to 9:00Pm']
    const dateList = [currentDate(), currentDate(1), currentDate(2), currentDate(3)]
    
    return <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {
                dateList.map(item=><Day key={item} active={`${item[0]}/${item[1]}/${item[2]}`===date} setActive={setDate} >{item}</Day>)
            }
        </ScrollView>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {
                timeList.map(item=><Time key={item} active={item===time} setActive={setTime} >{item}</Time>)
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
        borderRadius:10,
        padding:20,
        marginVertical:10,
        marginLeft:10,
        alignItems:'center',
    },
    activeTag:{
        backgroundColor:color.blue
    }

})
