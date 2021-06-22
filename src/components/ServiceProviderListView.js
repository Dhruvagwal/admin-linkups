import React from 'react'
import { StyleSheet, View, Image, Pressable, Linking, Dimensions } from 'react-native'
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import DateFormat from 'hooks/DateFormat'
import {Text, RowView} from 'styles'
import color from 'colors'
import TimeDiff from 'middlewares/TimeDiff'

import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'

const WIDTH = Dimensions.get('screen').width

const ServiceProviderListView = ({data={}, proposal=false, proposalData={}, order}) => {
    const IMAGE_SIZE = 65
    var rate = 0
    data.rating && data.rating.map(({rating})=>{rate=rating*1.2+rate})
    return (
        <Pressable onPress={()=>RootNavigation.navigate(CONSTANT.ServiceProfile, {data, proposal, orderId:order.id, proposalData})}>
            <RowView style={styles.container}>
                <Text regular style={{position: 'absolute',right:10, top:10}} size={10}>{proposalData.postedDate && TimeDiff(proposalData.postedDate).diff}</Text>
                <Image source={{uri:data.url}} style={{height:IMAGE_SIZE, width:IMAGE_SIZE, borderRadius:10}}/>
                <View style={{paddingHorizontal:10, height:'95%',width:'75%'}}>
                    <RowView>
                        {data.verified && <MaterialIcons name="verified" size={24} color={color.blue} style={{marginRight:2}} />}
                        <Text regular style={{width:WIDTH-120}} numberOfLines={1}>{data.name}</Text>
                    </RowView>
                    {data.rating ? <RowView style={{marginTop:5}}>
                        <Text size={15} regular>{rate/data.rating.length} </Text>
                        <AntDesign name="star" size={15} color={color.active} />
                    </RowView>
                    :
                    <Text  style={{marginTop:5}} size={13}>No Reviews</Text>
                    }
                </View>
                
            </RowView>
        </Pressable>
    )
}

export default ServiceProviderListView

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'rgba(18, 18, 18,0.8)',
        padding:10,
        borderRadius:20,
        height:80,
        marginBottom:10
    },
    Call:{
        backgroundColor:color.active, 
        borderRadius:10, 
        padding: 5,
        alignItems:'center',
        justifyContent:'center'
    }
})
