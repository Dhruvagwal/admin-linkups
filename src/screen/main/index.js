import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Pressable, Text, Button } from 'react-native'

import color from 'colors'
import Header from 'components/Header'
import {AuthConsumer} from 'context/auth'
import {DataConsumer} from 'context/data'
import Jobs from './Jobs'
import Library from './Library'
import { getCategory, newPost, updateProfile } from 'hooks/useData';
import Statistic from './stats'
import{ registerForPushNotificationsAsync } from 'middlewares/notification'
import List from '/data/HomeNavigation'

const Index = ({route:{params}})=>{
    const {state:{auth}} = AuthConsumer()
    const {state, Update} = DataConsumer()
    const [active, setActive] = useState(List[0])
    const [category, setCategory] = useState([])
    const [newOrder, setNewOrder] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    const loadData =async () =>{
        !refreshing && setRefreshing(true)
        const tokenNot = await registerForPushNotificationsAsync()
        if(tokenNot!== state.profile.token){
            await updateProfile({token:tokenNot})
            await Update()
        }
        
        if(state.profile.id!==undefined){
            const {data} = await  getCategory()
            const response = await newPost()
            const result = response.data.filter(item=>item.info.category === state.profile.category && state.profile.subCategory.find(cat=>cat===item.info.subCategory))
            var  sorted = result.filter(item=>!(item.proposal && item.proposal.find(item=>item.id===state.profile.id)))
            sorted = sorted.filter(item=>!(item.invited && item.invited.find(item=>item===state.profile.id)))
            const sortedProposed = result.filter(item=>(item.proposal && item.proposal.find(item=>item.id===state.profile.id)))
            const sortedInvites = result.filter(item=>(item.invited && item.invited.find(item=>item===state.profile.id)))
    
            setNewOrder(sorted)
            setCategory(data)
            setRefreshing(false)
            
            return {sortedProposed, sortedInvites}
        }
    }
    useEffect(()=>{
        params!==undefined && setActive(params.navigate)
    },[params])

    return <View style={{flex:1}}> 
            <Header setActive={setActive} active={active} List={List}/>
            <View style={{flex:1, backgroundColor:color.lightDark}}>
                {auth && <>
                    {active===List[0] && <Jobs setRefreshing={setRefreshing} refreshing={refreshing} newOrder={newOrder} category={category} loadData={loadData}/>}
                    {active===List[1] && <Library setRefreshing={setRefreshing} refreshing={refreshing} state={state.profile} category={category} loadData={loadData}/>}
                    {active===List[2] && <Statistic/>}
                </>
                }
            </View>
    </View>
}

export default Index
