import React, {useState, useEffect, useRef} from 'react'
import { RefreshControl, StyleSheet, Image, View ,Dimensions, Pressable, ScrollView, FlatList, Animated, Modal, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios'

import {Text, RowView} from 'styles'
import color from 'colors' 
import ServiceListView from 'components/ServiceListView' 
import Filter from './filter'
import TimeDiff from 'middlewares/TimeDiff'
import BottomBar from 'components/BottomBar'
import {getPost} from 'hooks/useData'

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
    const [data, setData] = useState([])
    const [filter, setFilter] = useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const [filterList, setFilterList] = useState([])

    const loadData = async (token)=>{
        try{
            setRefreshing(true);
            var postData = await getPost("service", token)
            postData = postData.data.filter(({status})=>status!=='cancelled')
            setData(postData)
            setRefreshing(false)
        }catch(err){
            alert('Something Wnent Wrong')
        }
    }
    useEffect(() => {
        let source = axios.CancelToken.source()
        loadData(source.token)
        return ()=>{
            source.cancel()
        }
    }, [routes])

    const applyFilter =async (reset=false)=>{
        setRefreshing(true);
        setFilter(false) 
        const postData = await getPost("service")
        if(!reset && filterList.length!==0){
            const filter_Result = postData.data.filter(({status})=>filterList.find(item=>item.toLowerCase()===status)) 
            setData(filter_Result)
        }
        else{
            setData(postData.data.filter(({status})=>status!=='cancelled'))
        }
        setRefreshing(false);
    }
    return (
        <View style={{flex:1}}>
            <Background/>
            {filter && <Filter filterList={filterList} applyFilter={applyFilter} setFilterList={setFilterList} setFilter={setFilter}/>}
            {/* ======================= */}
            <View style={{height:HEIGHT*.02}}/>
            {/* ======================== */}
            <View style={{flex:1, padding:20, paddingBottom:0}}>
                <RowView style={{marginBottom:20, justifyContent:'space-between'}}>
                    <View>
                        <Text size={20} bold>Linkups</Text>
                        <Text size={13}>Library</Text>
                    </View>
                    <RowView>
                        <Pressable onPress={()=>setFilter(true)} style={{padding:5}}>
                            <Ionicons name="filter-outline" size={24} color={color.white} />
                        </Pressable>
                    </RowView>
                </RowView>
                {/* ====================== */}
                {
                    data.length>0 ? 
                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        style={{flex:1}} 
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={loadData}
                                color={[color.active]}
                            />
                        }
                    >
                        { data
                            .sort((a,b)=>TimeDiff(a.postedAt).minutes-TimeDiff(b.postedAt).minutes)
                            .map(
                                item=>
                                    <ServiceListView data={item} key={item.id}/>
                                )
                        }
                        <Text>{'\n'}</Text>
                    </ScrollView>
                    :
                    <View style={{flex:0.8, alignItems:'center', justifyContent:'center'}}>
                        <Image source={require('../../../assets/nodata.png')} style={{width:200, height:200}} resizeMode='center'/>
                    </View>
                }
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
    }
})
