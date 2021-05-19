import React from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Pressable, Image } from 'react-native'

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import * as RootNavgation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'

const WIDTH = Dimensions.get('screen').width

const Tag = ({text})=><View style={styles.tag}>
    <Text size={12} regular>{text}</Text>
</View> 

const NewFeedListView = ({data={}, category=[], invited=false}) => {
    const ICON_SIZE = 25
    const result = category.find(item=>item.id===data.info.category)
    const SubCat = result.subCategory.find(item=>item.id===data.info.subCategory)
    return (
        <View style={styles.container}>
            <Pressable onPress={()=>RootNavgation.navigate(CONSTANT.OrderProfile,{result, SubCat, data, invited})} style={{padding:10}}>
                <RowView>
                    <Image source={{uri:SubCat.url}} style={{width:80, height:80}} />
                    <View style={{marginLeft:10}}>
                        <RowView>
                            <Text style={{width:WIDTH/2.2, marginRight:10}} numberOfLines={1} regular>{SubCat.name}</Text>
                            <Text size={13}>{data.id}</Text>
                        </RowView>
                        <RowView style={{justifyContent: 'space-between',marginTop:10}}>
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
                    </View>
                </RowView>
            </Pressable>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{position: 'absolute', bottom:15}}>
                <Tag text={result.name}/>
                <Tag text={data.info.problem}/>
            </ScrollView>
        </View>
    )
}

export default NewFeedListView

const styles = StyleSheet.create({
    container:{
        borderBottomColor:color.lightDark,
        borderBottomWidth:1,
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
