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
const stateList = ['subCategory', 'problem']

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'45deg'}, {translateY:-100}]}}/>
    </View>
}

const SubCategoryListView = ({data={}, setSelect,setState, setSub})=>{
    const _onPress = (item)=>{
        setSub(item)
        setState(res=>({...res, subCategory:item.id}))
        setSelect(stateList[1])
    }
    return <View style={{padding:20}}>
        <Text size={13} regular>{data.name}</Text>
        {
            data.subCategory.map(item=><Pressable onPress={()=>_onPress(item)} key={item.id} style={styles.contentContainer} android_ripple={{color:color.dark}}>
                        <Image source={{uri:item.url}} style={{height:50, width:50}}/>
                        <View style={{width:WIDTH-110}}>
                            <Text style={{marginLeft:10}} size={15} regular>{item.name}</Text>
                            <Text style={{marginLeft:10}} theme={color.active} size={13} bold>Service Charge ₹{item.charge}</Text>
                        </View>
                </Pressable>
            )
        }
    </View>
}

const AddOrder = ({navigation, route}) => {
    const {category, subCategory} = route.params
    const [sub, setSub] = useState()
    const {state:{profile}} = DataConsumer()
    const [provider, setProvider] = useState([])
    const [select, setSelect] = useState(stateList[0])
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState({category:category.id,subCategory:subCategory !== undefined ? subCategory.id :undefined})
    var index = stateList.indexOf(select)
    useEffect(()=>{
        getServiceProvider(category.id).then(({data})=>{
            const sortedInvite = data.filter(item=>
                getDistance(
                    { latitude: profile.coord.latitude, longitude: profile.coord.longitude },
                    { latitude: item.coord.latitude, longitude: item.coord.longitude }
                ) <= category.minDistance
            )
            setProvider(sortedInvite); 
        })
        const backAction = () => {
            index>0 ? setSelect(stateList[index-1]):navigation.goBack()
            return true
        };
      
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
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
            <>
                <Background/>
                <View style={{height:HEIGHT*.02}}/>
                <View style={{margin:20, marginBottom:0}}>
                    <Text size={20} bold>Linkups</Text>
                    <Text size={13}>Post Order</Text>
                </View>
                {
                    subCategory=== undefined ?
                    <>
                        {select===stateList[0] && <SubCategoryListView  setSub={setSub} setSelect={setSelect} setState={setState} data={category}/>}
                        {select===stateList[1] && <Problem setSuccess={setSuccess} setLoading={setLoading} subCategory={sub} state={state} data={provider}/>}
                    </>
                    :
                    <>
                        {select===stateList[0] && <Problem  setSuccess={setSuccess} setLoading={setLoading} subCategory={subCategory} state={state} data={provider}/>}
                    </>
                }
            </>
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
