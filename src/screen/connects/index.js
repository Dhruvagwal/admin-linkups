import React, {useEffect, useState} from 'react'
import { Pressable, ScrollView, StyleSheet, View, RefreshControl } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading'
import {DataConsumer} from 'context/data'
import {getDataById, getCategory} from 'hooks/useData'
import TimeDiff from 'middlewares/TimeDiff'
import moment from 'moment'
import { isEmergencyLaunch } from 'expo-updates'

const HistoryList = ({data, category, profile})=>{
    category = category.find(item=>item.id === data.info.category)
    const subCat = category ? category.subCategory.find(item=>item.id===data.info.subCategory) : {}
    return <RowView style={styles.List}>
        <View>
            <Text bold theme={color.active}>{subCat.name}</Text>
            <Text>{category && category.name}</Text>
            {data && <Text regular>At {moment(data.proposal.find(({id})=>id===profile.id).postedDate).format('LLL')}</Text>}
        </View>
        <View>
            {data.type==='sell' ? <Text theme={color.red} bold>- ₹ {data.amount}</Text>:
            <Text theme={color.blue} bold>+ ₹ {data.amount}</Text>}
        </View>
    </RowView>
}

const buyList = [50,100,200,500,1000,5000]
const Index = () => {
    const [history, setHistory] = useState([])
    const {state:{profile}, Update} = DataConsumer()
    const [category, setCategory] = useState([])
    const [active, setActive] = useState()
    const [refreshing, setRefreshing] = useState(false)
    useEffect(()=>{
        var list = []
        Update()
        profile.history && profile.history.map(async (item)=>{
            await getDataById('order', item.id).then(({data})=>{
                list = [...list,{...data, amount:item.amount, time:item.time, type:item.type}]
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
            <ScrollView refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={async ()=>await Update()}
                colors={[color.blue]}
                progressBackgroundColor={color.lightDark}
                
            />
            }>
                <View style={{padding:10}}>
                    <Text size={20} bold>Linkups</Text>
                    <Text size={13}>Wallet</Text>
                </View>
                <View style={{backgroundColor:color.lightDark, padding:5, alignItems:'center'}}>
                    <Text style={{marginHorizontal:10}} regular>Your Balance: ₹{profile.wallet}</Text>
                </View>
                <View style={{marginTop:20}}>
                    <Text regular style={{paddingHorizontal:10}}>Add</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingVertical:20, marginTop:-10}}>
                        {
                            buyList
                            .map(item=><Pressable onPress={()=>_buy(item)} style={[styles.tag, active===item && styles.activeTag]} key={item}>
                                <Text bold>₹{item}</Text>
                            </Pressable>)
                        }
                    </ScrollView>
                    <View style={{paddingHorizontal:10, marginTop:20}}>
                        {profile.history && <Text regular>History</Text>}
                        {
                            history
                            .sort((a,b)=>TimeDiff(a.proposal.find(item=>item.id===profile.id).postedDate).minutes-TimeDiff(b.proposal.find(item=>item.id===profile.id).postedDate).minutes)
                            .map(item=><HistoryList profile={profile} key={Math.random()} data={item} category={category}/>)
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
        justifyContent:'space-between'
    },
    activeTag:{
        backgroundColor:color.blue
    }
})
