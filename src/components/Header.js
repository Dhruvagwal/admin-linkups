import React, {useState} from 'react'
import { StyleSheet, View, Dimensions, Pressable } from 'react-native'
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import {DataConsumer} from 'context/data'

import {Text, RowView} from 'styles'
import color from 'colors'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const Header = ({setActive, active, List}) => {
    const {state:{profile}} =DataConsumer()
    const ICON_SIZE = 25
    return (
        <View style={styles.container}>
            <RowView style={{justifyContent:'space-between', marginTop:HEIGHT*.02}}>
                <View style={{padding:20, paddingBottom:10, height:70, marginBottom:10}}>
                    <Text size={20} bold>Linkups</Text>
                    {active===List[0] && <Text size={13}>New Jobs</Text>}
                    {active===List[1] && <Text size={13}>Library</Text>}
                    {active===List[2] && <Text size={13}>Statics</Text>}
                </View>
                <RowView style={styles.headerButton}>
                    <View style={styles.connects}>
                        <Text size={13} bold>{profile.connects} Connects</Text>
                    </View>
                    <Pressable style={{paddingLeft:10}}>
                        <Entypo name="dots-three-vertical" size={24} color={color.white} />
                    </Pressable>
                </RowView>
            </RowView>
            <RowView style={{width:WIDTH, justifyContent: 'space-evenly'}}>
                {
                    List.map(item=><Pressable key={item} onPress={()=>{setActive(item)}} style={[styles.button, active===item && styles.sperator]}>
                        <Ionicons name={item} size={ICON_SIZE} color={active===item?color.white:color.inActive} />
                    </Pressable>
                    )
                }
            </RowView>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    sperator:{
        borderBottomColor:color.active,
        borderBottomWidth:4
    },
    button:{
        width:WIDTH/3,
        alignItems:'center',
        paddingBottom:10
    },
    container:{
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        backgroundColor:color.dark
    },
    headerButton:{
        padding: 20
    },
    connects:{
        backgroundColor:color.blue,
        padding:10,
        borderRadius:10
    }
})
