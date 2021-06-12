import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet, Image, View ,Dimensions, Pressable, ScrollView} from 'react-native'
import axios from 'axios'

import {Text, RowView} from 'styles'
import color from 'colors' 
import BottomBar from 'components/BottomBar'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import Loading from 'components/Loading'
import {DataConsumer} from 'context/data'
import {getCategory, updateUserProfile} from 'hooks/useData'
import{ registerForPushNotificationsAsync } from 'middlewares/notification'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width
const PADDING = 20

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1550, width:'100%',transform:[{rotate:'36deg'}]}}/>
    </View>
}


const Index = ({route}) => {
    const routes = route.params
    const {setCat, state:{profile}, Update} = DataConsumer()
    const [category, setCategory] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    const loadData = async (token)=>{
        setRefreshing(true);
        if(category.length===0){
            const Category = await getCategory(token)
            setCategory(Category.data)
            setCat(Category.data)
        }
        const tokenNot = await registerForPushNotificationsAsync()
        tokenNot !== profile.token && await updateUserProfile({token:tokenNot}, token)
        setRefreshing(false)
        Update(token)
    }

    useEffect(() => {
        let source = axios.CancelToken.source()
        try{
            loadData(source.token)
        }catch(err){}
        return ()=>{
            source.cancel()
        }
    }, [routes])

    return (
        <View style={{flex:1}}>
            <Background/>
            {/* ======================= */}
            <View style={{height:HEIGHT*.02}}/>
            {/* ======================== */}
            <View style={{flex:1}}>
                <RowView style={{justifyContent:'space-between', padding:20}}>
                    <View>
                        <Text size={20} bold>Linkups</Text>
                        <Text size={13}>Home</Text>
                    </View>
                </RowView>
                {!refreshing ? <ScrollView>
                    <Text style={{marginHorizontal:20}} size={13}>Book Now :</Text>
                    <View style={styles.topContainer} >
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {
                                category.map(item=><Pressable android_ripple={{color:color.dark}} onPress={()=>RootNavigation.navigate(CONSTANT.AddOrder, {category:item})} key={item.id} style={{alignItems:'center', padding:10, width:WIDTH/2-20}}>
                                    <Image source={{uri:item.url}} style={{width:70, height:70}}/>
                                    <Text size={13} bold>{item.name}</Text>
                                </Pressable>)
                            }                                                                                                                                                                                           
                                                                                                                                                          
                        </ScrollView>
                    </View>
                    {
                        category.map(res=><View key={res.id} style={styles.middleContainer}>
                            {res.subCategory && <Text size={13} style={{marginHorizontal:20}}>From {res.name}s</Text>}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {
                                    res.subCategory && res.subCategory.map(item=>
                                        <Pressable android_ripple={{color:color.dark}} onPress={()=>RootNavigation.navigate(CONSTANT.AddOrder, {category:res, subCategory:item})} key={item.id} style={styles.subCategory}>
                                            <Image source={{uri:item.url}} style={{width:70, height:70}}/>
                                            <Text size={18} bold style={{marginHorizontal:10, width:'60%'}} numberOfLines={2}>{item.name}</Text>
                                        </Pressable>
                                    )
                                }
                            </ScrollView>
                        </View>)
                    }
                </ScrollView>:<Loading/>}
            </View>
            <BottomBar/>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    PostButton:{
        backgroundColor:color.active,
        position:'absolute',
        bottom:0,
        padding:PADDING,
        width:WIDTH,
        alignItems:'center',
        alignItems:'center',
        justifyContent:'center',
        height:70
    },
    contain:{
        padding:PADDING*.5,
        borderTopRightRadius:PADDING*.25,
        borderTopLeftRadius:PADDING*.25,
        textAlign:'center'
    },
    active:{
        backgroundColor:color.active,
        padding:2.5
    },
    menu:{
        position:'absolute', 
        right:25, 
        top:HEIGHT*.05, 
        backgroundColor: color.elevatedDark,
        borderRadius:5,
        width:WIDTH/1.8,
        elevation:5,
        zIndex:5,
        paddingVertical:10
    },
    menuItems:{
        padding:10
    },
    topContainer:{
        backgroundColor: 'rgba(34, 42, 56,0.8)',
        padding:10,
        borderRadius:10,
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom:20,
        margin:10
    },
    middleContainer:{
        marginBottom:20
    },
    subCategory:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: 'rgba(34, 42, 56,0.8)',
        borderRadius:10,
        padding:10,
        marginVertical:10,
        marginHorizontal:10,
        width:WIDTH/1.7,
    }
})
