import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet, Image, View ,Dimensions, Pressable, ScrollView, Modal, BackHandler, Alert} from 'react-native'
import axios from 'axios'

import {Text, RowView} from 'styles'
import color from 'colors' 
import BottomBar from 'components/BottomBar'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import Loading from 'components/Loading'
import {DataConsumer} from 'context/data'
import {getCategory, updateUserProfile} from 'hooks/useData'
import register, { registerForPushNotificationsAsync } from 'middlewares/notification'
import ScreenModal from 'components/ScreenModal'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width
const PADDING = 20

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1550, width:'100%',transform:[{rotate:'36deg'}]}}/>
    </View>
}


const Index = ({route, navigation}) => {
    const routes = route.params
    const {setCat, state:{profile}, Update} = DataConsumer()
    const [category, setCategory] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [activeCategory, setActiveCategory] = useState()
    const [goBack, setgoBack] = useState(false)

    const loadData = async (token)=>{
        setRefreshing(true);
        if(category.length===0){
            const {data} = await getCategory(token)

            setActiveCategory(data.reverse()[0].id)
            setCategory(data.reverse())
            setCat(data.reverse())
        }
        setRefreshing(false)
        const tokenNot = await registerForPushNotificationsAsync()
        if(tokenNot !== profile.token){
            updateUserProfile({token:tokenNot}, token)
            Update()
        } 
    }
    useEffect(() => {
        let source = axios.CancelToken.source()
        register()
        try{
            loadData(source.token)
        }catch(err){}
        // const backAction = () => {
        //     setgoBack(true)
        //     return true;
        //   };
      
        //   const backHandler = BackHandler.addEventListener(
        //     "hardwareBackPress",
        //     backAction
        //   );
      
        // return ()=>{
        //     source.cancel()
        //     backHandler.remove();
        // }
    }, [routes])

    return (
        <View style={{flex:1}}>
            <Background/>
            {/* {goBack && <ScreenModal>
                <Text bold>Hold On!</Text>
                <Text>Are you sure you want exit?</Text>
                <RowView style={{alignSelf:'flex-end', marginTop:10}}>
                    <Pressable style={{padding:10}} onPress={()=>setgoBack(false)}>
                        <Text bold size={13} theme={color.blue}>NO</Text>
                    </Pressable>
                    <Pressable style={{padding:10}} onPress={()=>BackHandler.exitApp()}>
                        <Text bold size={13}  style={{marginLeft:10}} theme={color.blue}> YES</Text>
                    </Pressable>
                </RowView>
            </ScreenModal>} */}
            {refreshing && <Modal transparent/>}
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
                    <View style={styles.topContainer} >
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                            <View style={{width:'100%',flexDirection:'row', justifyContent:'space-around'}}>
                                {
                                    category.map(item=><Pressable android_ripple={{color:color.dark}} onPress={()=>setActiveCategory(item.id)} key={item.id} style={[{alignItems:'center', padding:10, borderRadius:10, width:100, height:100, marginHorizontal:10}, activeCategory===item.id && {backgroundColor:color.blue}]}>
                                        <Image source={{uri:item.url}} style={{width:50, height:50}}/>
                                        <View style={{alignItems:'center'}}>
                                            {
                                                item.name.split(' ').map(item=><Text key={Math.random()} numberOfLines={1} adjustsFontSizeToFit size={10} bold>{item}</Text>)
                                            }
                                        </View>
                                    </Pressable>)
                                }
                            </View>
                        </ScrollView>
                    </View>
                    {
                        category.map(res=>res.id===activeCategory && <View key={res.id} style={styles.middleContainer}>
                                {
                                    res.subCategory && res.subCategory.map(item=>
                                        <Pressable android_ripple={{color:color.inActive}} onPress={()=>RootNavigation.navigate(CONSTANT.AddOrder, {category:res, subCategory:item})} key={item.id} style={styles.subCategory}>
                                            <Image source={{uri:item.url}} style={{width:50, height:50}}/>
                                            <View style={{marginLeft:10}}>
                                                <Text style={{width:WIDTH-100}} size={13} regular numberOfLines={1}>{item.name}</Text>
                                                <Text size={10} theme={color.blue} regular>Service Charge ₹{item.charge}</Text>
                                            </View>
                                        </Pressable>
                                    )
                                }
                        </View>)
                    }
                <Text>{'\n'}</Text>
                <Text>{'\n'}</Text>
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
        borderRadius:10,
        flexDirection:'row',
        justifyContent:'space-around',
        margin:10,
        width:WIDTH-20,
        marginVertical:5
    },
    middleContainer:{
        marginBottom:20
    },
    subCategory:{
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:2,
        borderBottomColor:color.lightDark,
        padding:10,
        marginHorizontal:10,
        paddingVertical:20
    }
})
