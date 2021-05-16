import React from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Pressable } from 'react-native'

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import * as RootNavgation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'

const WIDTH = Dimensions.get('screen').width

const Tag = ({text})=><View style={styles.tag}>
    <Text size={12} regular>{text}</Text>
</View> 

const NewFeedListView = () => {
    const ICON_SIZE = 25
    return (
        <View style={styles.container}>
            <Pressable onPress={()=>RootNavgation.navigate(CONSTANT.OrderProfile)} style={{padding:10}}>
                <RowView>
                    <Text size={18} style={{width:WIDTH/1.4, marginRight:10}} numberOfLines={1} regular>Washing Machine Repair</Text>
                    <Text size={13}>12 min ago</Text>
                </RowView>
                <RowView style={{justifyContent: 'space-evenly',marginTop:10}}>
                    <MaterialCommunityIcons name="truck-delivery" size={ICON_SIZE} color={color.active} />
                    <MaterialCommunityIcons name="clock-time-five" size={ICON_SIZE} color={color.active} />
                    <RowView>
                        <Text regular>5 </Text>
                        <MaterialIcons name="local-offer" size={ICON_SIZE} color={color.active} />
                    </RowView>
                    <RowView>
                        <Text regular>2.5m </Text>
                        <MaterialCommunityIcons name="map-marker-distance" size={ICON_SIZE} color={color.active} />
                    </RowView>
                </RowView>
            </Pressable>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{position: 'absolute', bottom:15}}>
                <Tag text='Electricity'/>
                <Tag text='Washing Machine Repair'/>
                <Tag text='Smoking Problem'/>
            </ScrollView>
        </View>
    )
}

export default NewFeedListView

const styles = StyleSheet.create({
    container:{
        borderBottomColor:color.lightDark,
        borderBottomWidth:5,
        height:150,
        backgroundColor:color.elevatedDark,
    },
    tag:{
        backgroundColor:color.lightDark,
        padding:5,
        marginHorizontal:5,
        borderRadius:100
    }
})
