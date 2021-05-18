import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Pressable, RefreshControl } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'; 

import {Text} from 'styles'
import color from 'colors'
import Header from 'components/Header'
import NewFeedListView from 'components/NewFeedListView'
import CategoryList from 'components/CategoryList'
import Loading from 'components/Loading'
import {AuthConsumer} from 'context/auth'
import {DataConsumer} from 'context/data'
import Login from './Login'
import { Logout } from 'hooks/useAuth';
import { getCategory, newPost } from 'hooks/useData';

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const Jobs = ({newOrder, category, loadData}) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const refresh = async ()=>{
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
    }

    return (
        <>        
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        color={[color.active]}
                    />
                }
            >
                <View style={{flex:1, backgroundColor:color.lightDark}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            newOrder.map(item=><NewFeedListView key={item.id} data={item} category={category}/>)
                        }
                        <Text>{'\n'}</Text>
                    </ScrollView>
                </View>
            </ScrollView>
            <View style={styles.filter}>
                <MaterialIcons name="filter-alt" size={40} color={color.white} />
            </View>
        </>
    )
}

const Library = ()=>{
    return <View style={{flex:1}}>
        <Text>Dhruv</Text>
    </View>
}

const Index = ()=>{
    const {state:{auth}, setAuth} = AuthConsumer()
    const {state, Update} = DataConsumer()
    const List = ['flame', 'library', 'md-pie-chart-outline']
    const [active, setActive] = useState(List[0])
    const [category, setCategory] = useState([])
    const [loading, setLoading] = useState(true)
    const [newOrder, setNewOrder] = useState([])

    const LOGOUT = async ()=>{
        await setAuth(false)
        Logout()
    }
    const loadData =async () =>{
        const {data} = await  getCategory()
        setCategory(data)
        const response = await newPost()
        const result = response.data.filter(item=>item.info.category === state.profile.category)
        const sorted = result.filter(item=>!(item.proposal && item.proposal.find(item=>item===state.profile.id)))
        setNewOrder(sorted)
        setLoading(false)
    }

    useEffect(()=>{
        loadData()
    },[])
    
    return <View style={{flex:1}}>
        {
            loading ? <Loading/> :
            <>        
                {state.profile.category===undefined && <CategoryList category={category} Update={Update}/>}
                <Header setActive={setActive} active={active} List={List}/>
                <View style={{flex:1, backgroundColor:color.lightDark}}>
                    {auth?<>
                        {active===List[0] && <Jobs newOrder={newOrder} category={category} loadData={loadData}/>}
                        {active===List[1] && <Library/>}
                        <Pressable onPress={LOGOUT}>
                            <Text>Logout</Text>
                        </Pressable>
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
    filter:{
        position: 'absolute',
        bottom:20,
        right:20,
        padding:10,
        backgroundColor:color.blue,
        borderRadius:100,
        opacity: 0.95,
    },
    loading:{
        position: 'absolute',
        width:200,
        bottom:-22,
        alignSelf:'center'
    },
})
