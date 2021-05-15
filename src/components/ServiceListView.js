import React from 'react'
import { StyleSheet, View, Dimensions, Pressable, Image, ImageBackground } from 'react-native'
import moment from 'moment'

import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'

import {Text, RowView} from 'styles'
import color from 'colors'
import TimeDiff from 'middlewares/TimeDiff'

const WIDTH = Dimensions.get('screen').width

const ServiceListView = () => {
    const diff =TimeDiff(new Date(), new Date('2021-05-14'))

    return (
        <Pressable onPress={()=>RootNavigation.navigate(CONSTANT.OrderDescription)} style={styles.container}>
                <RowView>
                    <Image source={require('../../assets/washing-machine.png')} style={{width:100, height:100}}/>
                    <View style={{justifyContent: 'space-between',marginBottom:5, marginLeft:10}}>
                        <Text style={{width:WIDTH*.6}} bold numberOfLines={2} adjustsFontSizeToFit>Washing Machine Dryer not Working</Text>
                        <Text size={12}>{diff}</Text>
                        <Text>Burning Smell</Text>
                    </View>
                </RowView>
        </Pressable>
    )
}

export default ServiceListView

const styles = StyleSheet.create({
    container:{
        marginBottom:10,
        overflow:'hidden',
        height:150,
        padding:10,
        justifyContent:'center',
        borderBottomColor:color.lightDark,
        borderBottomWidth:2.5
    }
})
