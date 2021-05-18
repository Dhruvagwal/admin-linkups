import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Pressable } from 'react-native'
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
import { getCategory } from 'hooks/useData';

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const Jobs = () => {
    return (
        <View style={{flex:1, backgroundColor:color.lightDark}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <NewFeedListView/>
                <NewFeedListView/>
                <Text>{'\n'}</Text>
                {/* <LottieView
                    source={require('../../../assets/lottieFiles/loadData.json')}
                    style={styles.loading}
                    autoPlay
                /> */}
            </ScrollView>
            <View style={styles.filter}>
                <MaterialIcons name="filter-alt" size={40} color={color.white} />
            </View>
        </View>
    )
}

const Library = ()=>{
    const List = ['Proposals', 'Active', 'Pending', 'Completed']
    const [active, setActive] = useState(List[0])
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

    const LOGOUT = async ()=>{
        await setAuth(false)
        Logout()
    }

    useEffect(()=>{
        getCategory().then(({data})=>{setCategory(data); setLoading(false)})
    },[])

    return <View style={{flex:1}}>
        {
            loading ? <Loading/> :
            <>        
                {state.profile.category===undefined && <CategoryList category={category} Update={Update}/>}
                <Header setActive={setActive} active={active} List={List}/>
                <View style={{flex:1, backgroundColor:color.lightDark}}>
                    {auth?<>
                        {active===List[0] && <Jobs/>}
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
