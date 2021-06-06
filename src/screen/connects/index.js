import React, {useEffect, useState} from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'

import {Text} from 'styles'
import color from 'colors'
import Loading from 'components/Loading'
import {DataConsumer} from 'context/data'
import {getDataById, getCategory} from 'hooks/useData'
import TimeDiff from 'middlewares/TimeDiff'
import moment from 'moment'

const HistoryList = ({data, category, profile})=>{
    category = category.find(item=>item.id === data.info.category)
    const subCat = category ? category.subCategory.find(item=>item.id===data.info.subCategory) : {}
    return <View style={styles.List}>
        <Text bold theme={color.active}>{subCat.name}</Text>
        <Text>{category && category.name}</Text>
        <Text regular>At {moment(data.proposal.find(({id})=>id===profile.id).postedDate).format('LLL')}</Text>
    </View>
}

const buyList = [50,100,200,500,1000,5000]
const Index = () => {
    const [history, setHistory] = useState([])
    const {state:{profile}} = DataConsumer()
    const [category, setCategory] = useState([])
    const [active, setActive] = useState(buyList[1])
    useEffect(()=>{
        var list = []
        profile.history.map(async (item)=>{
            await getDataById('order', item).then(({data})=>{
                list = [...list,data]
            })
            setHistory(list)
        })
        getCategory().then(({data})=>setCategory(data))
    },[])

    const _buy = (data)=>{
        console.log(data)
        setActive(data)
    }

    return (
        <View style={{flex:1, paddingTop:35}}>
            <ScrollView>
                <View style={{padding:10}}>
                    <Text size={20} bold>Linkups</Text>
                    <Text size={13}>Connects</Text>
                </View>
                <View style={{backgroundColor:color.lightDark, padding:5, alignItems:'center'}}>
                    <Text style={{marginHorizontal:10}} theme={color.red} regular>{profile.connects} connects Available</Text>
                </View>
                <View style={{marginTop:20}}>
                    <Text regular style={{paddingHorizontal:10}}>Purchase</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingVertical:20, marginTop:-10}}>
                        {
                            buyList
                            .map(item=><Pressable onPress={()=>_buy(item)} style={[styles.tag, active===item && styles.activeTag]} key={item}>
                                <Text bold>{item} Connects</Text>
                            </Pressable>)
                        }
                    </ScrollView>
                    <View style={{paddingHorizontal:10, marginTop:20}}>
                        <Text regular>History</Text>
                        {
                            history
                            .sort((a,b)=>TimeDiff(a.proposal.find(item=>item.id===profile.id).postedDate).minutes-TimeDiff(b.proposal.find(item=>item.id===profile.id).postedDate).minutes)
                            .map(item=><HistoryList profile={profile} key={item.id} data={item} category={category}/>)
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    tag:{
        backgroundColor:color.lightDark,
        padding:10,
        width:150,
        marginLeft:10,
        alignItems:'center',
        borderRadius:10,
    },
    List:{
        borderRadius:10,
        marginVertical:10,
        padding:10,
        borderBottomWidth:.5,
        borderBottomColor:color.lightDark,
    },
    activeTag:{
        backgroundColor:color.blue
    }
})
