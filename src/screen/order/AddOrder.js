import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Dimensions, Image, Pressable, BackHandler} from 'react-native'

import {Text} from 'styles'
import color from 'colors'
import Loading from 'components/Loading'
import getDistance from 'geolib/es/getDistance';
import {getServiceProvider, saveOrder, Message} from 'hooks/useData'
import {DataConsumer} from 'context/data'
import LottieView from 'lottie-react-native';
import Problem from './Problem'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'45deg'}, {translateY:-100}]}}/>
    </View>
}

const AddOrder = ({route}) => {
    const {category, subCategory} = route.params
    const {state:{profile}, Update} = DataConsumer()
    const [provider, setProvider] = useState([])
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const state = {category:category.id,subCategory:subCategory !== undefined ? subCategory.id :undefined}
    useEffect(()=>{
        getServiceProvider(category.id).then(async ({data})=>{
            await Update()
            const sortedInvite = data.filter(item=>
                getDistance(
                    { latitude: profile.coord.latitude, longitude: profile.coord.longitude },
                    { latitude: item.coord.latitude, longitude: item.coord.longitude }
                ) <= category.minDistance
            )
            setProvider(sortedInvite); 
        })
    },[])
    if(success){
        return <View style={{flex:1}}>            
                <LottieView
                    source={require('../../../assets/lottieFiles/loading.json')}
                    style={styles.loading}
                    autoPlay
                />
                <LottieView
                    source={require('../../../assets/lottieFiles/popper.json')}
                    style={{width:WIDTH, height:HEIGHT, position:'absolute'}}
                    autoPlay
                />
        </View>
    }
    else if(loading) return <Loading/>
    else return (
        <View style={{flex:1}}>
                <Background/>
                <View style={{height:HEIGHT*.02}}/>
                <View style={{margin:20, marginBottom:0}}>
                    <Text size={20} bold>Linkups</Text>
                    <Text size={13}>Post Order</Text>
                </View>
                <Problem  setSuccess={setSuccess} setLoading={setLoading} subCategory={subCategory} state={state} data={provider}/>
        </View>

    )
}

export default AddOrder

const styles = StyleSheet.create({
    contentContainer:{
        backgroundColor: 'rgba(34, 42, 56,0.8)',
        marginVertical:10,
        padding:10,
        flexDirection:'row',
        alignItems:'center',
        borderRadius:10
    },
})
