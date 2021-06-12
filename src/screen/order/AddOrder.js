import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Image, Pressable, TextInput, BackHandler, KeyboardAvoidingView} from 'react-native'
import { MaterialIcons, Entypo, AntDesign, Feather } from '@expo/vector-icons';

import ImagePicker from 'components/ImagePicker'

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import {getCategory} from 'hooks/useData'
import useKeyboard from 'hooks/useKeyboard'
import Calendar from 'components/calendar'
// import BackHandler from 'hooks/useBackHandler'


const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width
const stateList = ['subCategory', 'problem', 'time']

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'45deg'}, {translateY:-100}]}}/>
    </View>
}

const SubCategoryListView = ({data={}, setSelect,state, setState, setSub})=>{
    const _onPress = (item)=>{
        setSub(item)
        setState(res=>({...res, subCategory:item.id}))
        setSelect(stateList[1])
    }
    return <View style={{padding:20}}>
        <Text size={13} regular>{data.name}</Text>
        {
            data.subCategory.map(item=><Pressable onPress={()=>_onPress(item)} key={item.id} style={styles.contentContainer} android_ripple={{color:color.dark}}>
                        <Image source={{uri:item.url}} style={{height:100, width:100}}/>
                        <Text style={{marginLeft:10, width:'65%'}} size={15} bold>{item.name}</Text>
                </Pressable>
            )
        }
    </View>
}

const Time = ({state, category})=>{
    const [date, setDate] =useState()
    const [time, setTime] =useState()
    const _onPress = (item)=>{
        RootNavigation.navigate(CONSTANT.Invitation,{...state, time, date, categoryData:category})
    }
    return <View style={{flex: 1,padding:10, marginTop:10}}>
        <Text size={13} style={{marginHorizontal:10}} regular>Set Deadline</Text>
        <Calendar date={date} setDate={setDate} time={time} setTime={setTime}/>
        {(time && date) && <Pressable onPress={_onPress} style={styles.Button}>
            <Text>Save</Text>
        </Pressable>}
    </View>
}

const Problem = ({setSelect,state, setState, subCategory}) =>{
    const [text, setText] = useState('')
    const _onPress =async (item)=>{
        setState({...state, problem:item?item:text})
        subCategory === undefined ?  setSelect(stateList[2]) : setSelect(stateList[1])
    }
    const active = useKeyboard()
    const reason = subCategory.problem? subCategory.problem : subCategory.reason
    return <View style={{padding:20, flex:1}}>
        {!active && <>
        {
            subCategory.problem?
            <Text size={13} regular>Problem Face</Text>
            :
            <Text size={13} regular>For</Text>
        }
        {
            reason.map(item=><Pressable onPress={()=>_onPress(item)} key={item} style={[styles.contentContainer, {padding:20, justifyContent:'center'}]} android_ripple={{color:color.dark}}>
                <Text bold>{item}</Text>
            </Pressable>)
        }
        </>}
        <View style={[styles.contentContainer, {justifyContent:'center'}]} android_ripple={{color:color.dark}}>
                <TextInput
                    placeholder='Edit'
                    value={text}
                    onChangeText={setText}
                    placeholderTextColor={color.white}
                    style={{
                        fontFamily:'Montserrat-Bold',
                        width:'100%',
                        textAlign:'center',
                        fontSize:15,
                        color:color.white,
                    }}
                    multiline
                />
        </View>
        {active &&
                <Pressable onPress={()=>_onPress()} style={styles.button}>
                    <Text regular>Submit</Text>
                </Pressable>}
    </View>
}

const AddOrder = ({navigation, route}) => {
    const {category, subCategory} = route.params
    const [data, setData] = useState(category)
    const [sub, setSub] = useState()
    const [select, setSelect] = useState(stateList[0])
    const [state, setState] = useState({category:category.id,subCategory:subCategory !== undefined ? subCategory.id :undefined})
    var index = stateList.indexOf(select)
    useEffect(()=>{
        const backAction = () => {
            index>0 ? setSelect(stateList[index-1]):navigation.goBack()
            return true
        };
      
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    },[index])
    return (
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
                        {select===stateList[0] && <SubCategoryListView  setSub={setSub} state={state} setSelect={setSelect} setState={setState} data={data}/>}
                        {select===stateList[1] && <Problem subCategory={sub} state={state} setSelect={setSelect} setState={setState} data={data}/>}
                        {select===stateList[2] && <Time category={category} state={state} setSelect={setSelect} setState={setState}/>}
                    </>
                    :
                    <>
                        {select===stateList[0] && <Problem subCategory={subCategory} state={state} setSelect={setSelect} setState={setState} data={data}/>}
                        {select===stateList[1] && <Time category={category} state={state} setSelect={setSelect} setState={setState}/>}
                    </>
                }
            </>
        </View>

    )
}

export default AddOrder

const styles = StyleSheet.create({
    Button:{
        backgroundColor: color.active,
        position:'absolute',
        bottom:0,
        padding: 20,
        width:WIDTH,
        alignItems:'center',
        justifyContent:'center'
    },
    contentContainer:{
        backgroundColor: 'rgba(34, 42, 56,0.8)',
        marginVertical:10,
        padding:10,
        flexDirection:'row',
        alignItems:'center',
    },
    button:{
        backgroundColor:color.active,
        padding:10,
        alignItems:'center',
        alignSelf:'center',
        borderRadius:10,
        marginTop:20
    }
})
