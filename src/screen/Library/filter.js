import React, {useState} from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Entypo } from '@expo/vector-icons'; 

import ScreenModal from 'components/ScreenModal'
import CheckBox from 'components/checkBox'
import Status from 'data/Status.json'
import {Text, RowView} from 'styles'
import color from 'colors'

const filter = ({setFilter,setFilterList, applyFilter, filterList}) => {
    var props = [
        {label: Status.Paid, value: Status.Paid },
        {label: Status.Posted, value: Status.Posted },
        {label: Status.Cancelled, value: Status.Cancelled },
        {label: 'In Progress', value: Status.InProgress },
        {label: Status.Completed, value: Status.Completed },
    ];

    return (
        <ScreenModal style={{padding:0, paddingVertical:20}}>
            {/* =========================== */}
            <View>
                <Text  style={{marginHorizontal:20,color:color.active}} size={15} bold>Filter by</Text>
                <View style={{marginTop:10}}>
                    <Text style={{marginHorizontal:20,color:color.blue, marginHorizontal:20}} size={13} bold>Status</Text>
                    <View style={{marginTop:10}}>
                        {
                            props.map(item=><CheckBox setFilterList={setFilterList} active={filterList.find(res=>res===item.value)} key={item.value} data={item} />)
                        }
                    </View>
                </View>
                <RowView style={{justifyContent: 'space-between',}}>
                    <Pressable style={styles.Reset} onPress={()=>{setFilterList([]); applyFilter(true)}}>
                        <Text bold>Reset</Text>
                    </Pressable>
                    <Pressable style={styles.Apply} onPress={()=>applyFilter(false)}>
                        <Text bold>APPLY</Text>
                    </Pressable>
                </RowView>
            </View>
            {/* ============================ */}
                    
            <Pressable style={styles.close} onPress={()=>setFilter(false)}>
                <Entypo name="cross" size={30} color={color.inActive} />
            </Pressable>
        </ScreenModal>
    )
}

export default filter

const styles = StyleSheet.create({
    close:{
        position:'absolute',
        top:0,
        right:0,
        padding: 20,
    },
    Apply:{
        backgroundColor: color.blue, 
        alignSelf:'flex-end', 
        padding:10, 
        margin:20,
        borderRadius:10
    },
    Reset:{
        borderWidth:2,
        padding:10,
        margin:20,
        borderRadius:10,
        borderColor:color.inActive
    }
})
