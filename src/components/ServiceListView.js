import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import moment from 'moment'

import {Text, RowView} from 'styles'
import color from 'colors'
import TimeDiff from 'middlewares/TimeDiff'

const WIDTH = Dimensions.get('screen').width

const ServiceListView = () => {
    const diff =TimeDiff(new Date(), new Date('2021-05-14'))

    return (
        <View style={[styles.container, {paddingBottom:10}]}>
            <RowView style={{justifyContent: 'space-between',marginBottom:5}}>
                <Text style={{width:WIDTH*.7}} bold numberOfLines={2} adjustsFontSizeToFit>Washing Machine Dryer not Working</Text>
                <Text size={12}>{diff}</Text>
            </RowView>
            <Text>Burning Smell</Text>
        </View>
    )
}

export default ServiceListView

const styles = StyleSheet.create({
    container:{
        borderBottomColor:color.lightDark,
        borderBottomWidth:5,
        marginBottom:10
    }
})
