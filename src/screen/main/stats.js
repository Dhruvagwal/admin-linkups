import React from 'react'
import { StyleSheet, View,ScrollView } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'
import LineChart from 'components/chart/lineChart'

const stats = () => {
    return (
        <View style={{padding:10}}>
            <ScrollView>
                <LineChart/>
                <View style={{marginTop:10}}>
                    <Text size={13} regular>Profile</Text>
                    <RowView style={styles.container}>
                        <View style={[styles.dataContainer,{width:'50%'}]}>
                            <Text size={20} regular>36</Text>
                            <Text>Invitation</Text>
                        </View>
                        <View style={[styles.dataContainer,{borderRightWidth:0, width:'50%'}]}>
                            <Text size={20} regular>36</Text>
                            <Text>Completed</Text>
                        </View>
                    </RowView>
                </View>
                <View style={{marginTop:30}}>
                    <Text size={13} regular>Work History</Text>
                    <RowView style={styles.container}>
                        <View style={styles.dataContainer}>
                            <Text size={20} regular>36</Text>
                            <Text>Invitation</Text>
                        </View>
                        <View style={styles.dataContainer}>
                            <Text size={20} regular>36</Text>
                            <Text>Pending</Text>
                        </View>
                        <View style={[styles.dataContainer,{borderRightWidth:0}]}>
                            <Text size={20} regular>36</Text>
                            <Text>Completed</Text>
                        </View>
                    </RowView>
                </View>
            </ScrollView>
        </View>
    )
}

export default stats

const styles = StyleSheet.create({
    dataContainer:{
        alignItems:'center',
        borderRightColor:color.lightDark,
        borderRightWidth:1,
        width:'33%'
    },
    container:{
        backgroundColor:color.elevatedDark,
        justifyContent:'space-between',
        padding:10,
        borderRadius:10,
        marginTop:10
    }
})
