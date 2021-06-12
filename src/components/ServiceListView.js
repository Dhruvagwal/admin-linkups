import React from 'react'
import { StyleSheet, View, Dimensions, Pressable, Image, ImageBackground } from 'react-native'
import moment from 'moment'

import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {DataConsumer} from 'context/data'
import {Text, RowView} from 'styles'
import color from 'colors'
import TimeDiff from 'middlewares/TimeDiff'

const WIDTH = Dimensions.get('screen').width

const ServiceListView = ({data={}}) => {
    const {state:{category}} = DataConsumer()
    const diff =TimeDiff(data.postedAt)
    const result = category.find(item=>item.id===data.info.category)
    const SubCat = result.subCategory.find(item=>item.id===data.info.subCategory)
    return (
        <Pressable onPress={()=>RootNavigation.navigate(CONSTANT.OrderDescription,{id:data.id})} style={styles.container}>
                <RowView style={{justifyContent:'space-between', width:'100%'}}>
                    <Image source={{uri:SubCat.url}} style={{width:70, height:70}}/>
                    <View style={{justifyContent: 'space-between',marginBottom:5, marginLeft:10,height:'80%', width :'95%'}}>
                        <Text style={{width:WIDTH*.5}} bold numberOfLines={1}>{SubCat.name}</Text>
                        <RowView style={{justifyContent:'space-between', width:'80%'}}>
                            <Text size={13} numberOfLines={1}>{diff.diff}</Text>
                            <Text size={13} bold style={{textTransform:'capitalize', color:color.active}}>{data.status}</Text>
                        </RowView>
                        <Text>{data.info.problem}</Text>
                    </View>
                </RowView>
        </Pressable>
    )
}

export default ServiceListView

const styles = StyleSheet.create({
    container:{
        overflow:'hidden',
        height:110,
        padding:10,
        justifyContent:'center',
        borderBottomColor:color.lightDark,
        borderBottomWidth:2.5
    }
})
