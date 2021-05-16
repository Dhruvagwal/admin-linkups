import React, {useState} from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'; 

import LottieView from 'lottie-react-native'

import {Text} from 'styles'
import color from 'colors'
import Header from 'components/Header'
import NewFeedListView from 'components/NewFeedListView'

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

const Index = ()=>{
    const List = ['flame', 'library', 'md-pie-chart-outline']
    const [active, setActive] = useState(List[0])
    return <View style={{flex:1}}>
        <Header setActive={setActive} active={active} List={List}/>
        <View style={{flex:1, backgroundColor:color.lightDark}}>
            {active===List[0] && <Jobs/>}
        </View>
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
    }
})
