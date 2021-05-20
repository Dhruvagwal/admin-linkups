import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Pressable, RefreshControl, FlatList, AsyncStorage } from 'react-native'

import color from 'colors'
import Header from 'components/Header'
import CategoryList from 'components/CategoryList'
import Loading from 'components/Loading'
import {AuthConsumer} from 'context/auth'
import {DataConsumer} from 'context/data'
import Login from './Login'
import Jobs from './Jobs'
import Library from './Library'
import { Logout } from 'hooks/useAuth';
import { getCategory, newPost } from 'hooks/useData';
import Statistic from './stats'


const Index = ()=>{
    const {state:{auth}, setAuth} = AuthConsumer()
    const {state, Update} = DataConsumer()
    const List = ['flame', 'library', 'md-pie-chart-outline']
    const [active, setActive] = useState(List[0])
    const [category, setCategory] = useState([])
    const [loading, setLoading] = useState(true)
    const [newOrder, setNewOrder] = useState([])
    const [invited, setInvited] = useState([])
    const [proposed, setProposed] = useState([])

    const LOGOUT = async ()=>{
        await setAuth(false)
        Logout()
    }
    const loadData =async () =>{
        const {data} = await  getCategory()
        setCategory(data)
        const response = await newPost()
        const result = response.data.filter(item=>item.info.category === state.profile.category)
        var  sorted = result.filter(item=>!(item.proposal && item.proposal.find(item=>item.id===state.profile.id)))
        sorted = sorted.filter(item=>!(item.invited && item.invited.find(item=>item===state.profile.id)))
        const sortedProposed = result.filter(item=>(item.proposal && item.proposal.find(item=>item.id===state.profile.id)))
        const sortedInvites = result.filter(item=>(item.invited && item.invited.find(item=>item===state.profile.id)))
        setNewOrder(sorted)
        setProposed(sortedProposed)
        setInvited(sortedInvites)
        setLoading(false)
    }

    useEffect(()=>{
        loadData()
    },[])
    
    return <View style={{flex:1}}>
        {
            loading ? <Loading/> :
            <>        
                {state.profile.category===undefined && !auth && <CategoryList category={category} Update={Update}/>}
                <Header setActive={setActive} active={active} List={List}/>
                <View style={{flex:1, backgroundColor:color.lightDark}}>
                    {auth?<>
                        {active===List[0] && <Jobs newOrder={newOrder} category={category} loadData={loadData}/>}
                        {active===List[1] && <Library proposed={proposed} invited={invited} state={state.profile} category={category} loadData={loadData}/>}
                        {active===List[2] && <Statistic/>}
                        {/* <Pressable onPress={LOGOUT}>
                            <Text>Logout</Text>
                        </Pressable> */}
                    </>
                    :
                    <Login/>}
                </View>
            </>
        }
    </View>
}

export default Index

const styles = StyleSheet.create({
})
