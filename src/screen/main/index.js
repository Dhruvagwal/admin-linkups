import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet, Image, View ,Dimensions, Pressable, ScrollView, FlatList, Animated } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading' 
import ServiceListView from 'components/ServiceListView' 


const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width
const PADDING = 20

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1550, width:'100%',transform:[{rotate:'36deg'}]}}/>
    </View>
}


const Index = () => {
    const ServiceStatus = ['Posted', 'Processing', 'Checkout', 'Cancelled', 'Completed'] 
    const [active, setActive] = useState(ServiceStatus[0])
    const [loading, setLoading] = useState(false)
        
    useEffect(() => {
        setLoading(false)
        const intervalId  = setInterval(()=>{
            setLoading(false)
        },2000)
        return ()=>clearInterval(intervalId)
    }, [active])
    return (
        <View style={{flex:1}}>
            <Background/>
            {/* ======================= */}
            <View style={{height:HEIGHT*.05}}/>
            {/* ======================== */}
            <View style={{padding:PADDING, flex:1}}>
                <View style={{marginBottom:30}}>
                    <Text size={30} bold>Linkups</Text>
                    <Text>Home</Text>
                </View>

                {/* ====================== */}
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={ServiceStatus}
                    style={{alignSelf:'center', flexGrow:0, marginBottom:20}}
                    keyExtractor={(item)=>item}
                    renderItem={({item})=>
                    <Pressable onPress={()=>setActive(item)} key={item}>
                        <Text style={{...styles.contain,backgroundColor:item===active?color.lightDark:'#0000'}}>{item}</Text>
                        {item===active && <View style={styles.active}/>}
                    </Pressable>}
                />
                {/* =============================== */}
                <ScrollView showsVerticalScrollIndicator={false} style={{flex:1}}>
                    {loading ?<View style={{height:HEIGHT*.5, alignItems:'center', justifyContent:'center'}}>
                            <Loading/>
                    </View>
                    :
                        [1,2,3,4,5,6,7,8].map(item=><ServiceListView status={active} key={item}/>)
                    }
                </ScrollView>
                </View>
            {/* ======================= */}
                <Pressable style={styles.PostButton}>
                        <Text regular>Post Order</Text>
                </Pressable>
            {/* ======================= */}
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    PostButton:{
        backgroundColor:color.active,
        position:'absolute',
        bottom:0,
        right:0,
        padding:PADDING,
        width:WIDTH,
        alignItems:'center'
    },
    contain:{
        padding:PADDING*.5,
        borderTopRightRadius:PADDING*.25,
        borderTopLeftRadius:PADDING*.25,
    },
    active:{
        backgroundColor:color.active,
        padding:2.5
    }
})
