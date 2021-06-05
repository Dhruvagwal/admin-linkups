import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Image, BackHandler, Pressable } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading'
import TextInput from 'components/TextInput'
import CONSTANT from 'navigation/navigationConstant.json'
import {getCategory} from 'hooks/useData'
import {AuthConsumer} from 'context/auth'
import { MaterialIcons } from '@expo/vector-icons'; 
import {createUser} from 'hooks/useAuth'

const screens = ['category', 'subCategory', 'name', 'address']

const Category = ({setSelect, setData})=>{
    const [category, setCategory] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        getCategory().then(({data})=>{setCategory(data); setLoading(false)})
    },[])
    const _onPress = (data)=>{
        setData({Category:data, subCategory:[]})
        setSelect(screens[1])
    }
    return !loading ? <View>
        <Text style={{marginVertical:20}}>Choose Category</Text>
        {
            category.map(item=><Pressable onPress={()=>_onPress(item)} key={item.id} android_ripple={{color:color.dark}} style={styles.categoryContainer}>
                    <RowView>
                    <Image source={{uri:item.url}} style={{height:70, width:70}}/>
                    <Text size={20} bold style={{marginLeft:10}}>{item.name}</Text>
                    </RowView>
                </Pressable>
            )
        }
    </View>
    :
    <Loading/>
}

const SubCategory = ({setSelect, setData, data})=>{
    const _onPress = (item)=>{
        const subCategory =  data.subCategory.find(res=>res===item) ? data.subCategory.filter(res=>res!==item) : [...data.subCategory, item]
        setData({...data,subCategory})
        setSelect(screens[1])
    }
    return <View style={{flex:1}}>
        <Text style={{marginVertical:20}}>Choose Sub Category</Text>
        {
            data.Category.subCategory.map(item=><Pressable key={item.id} onPress={()=>_onPress(item.id)} style={[styles.categoryContainer, data.subCategory.find(res=>res===item.id) && styles.activeSubCat]}>
                    <RowView>
                    <Image source={{uri:item.url}} style={{height:70, width:70}}/>
                    <Text size={20} adjustsFontSizeToFit numberOfLines = {2} bold style={{marginLeft:10, width:'70%'}}>{item.name}</Text>
                </RowView>
                </Pressable>
            )
        }
        <Pressable style={styles.next} onPress={()=>setSelect(screens[2])} android_ripple={{color:color.lightDark}}>
            <Text>Next</Text>
            <MaterialIcons name="navigate-next" size={30} color={color.white} />
        </Pressable>
    </View>
}

const TextInputField = ({label='', heading='', onPress = ()=>{}, setValue=()=>{}, pressLabel='Next'})=>{
    return <View style={{flex:1}}>
        <View style={{flex:.5, justifyContent:'space-evenly'}}>
            <Text size={20} bold>{heading}</Text>
            <TextInput  setValue={setValue} label={label}/>
        </View>
        <Pressable style={styles.next} onPress={onPress} android_ripple={{color:color.lightDark}}>
            <Text>{pressLabel}</Text>
            {pressLabel==='Next' && <MaterialIcons name="navigate-next" size={30} color={color.white} />}
        </Pressable>
    </View> 
}

const SignUp = ({route, navigation}) => {
    const [select, setSelect] = useState(screens[0])
    const [data, setData] = useState({subCategory:[]})
    const {PhoneNumber} = route.params
    const index = screens.indexOf(select)
    const {setAuth} = AuthConsumer()

    useEffect(() => {
        const backAction = () => {
            index>0 ? setSelect(screens[index-1]) : navigation.navigate(CONSTANT.Login)
            return true
        };
      
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [index])

    const _onSubmit = async ()=>{
        const updateData={
            Address:data.address,
            category:data.Category.id,
            subCategory:data.subCategory,
            name:data.name,
            phone: PhoneNumber 

        }
        await createUser(updateData)
        setAuth(true)
    }
    return (
        <View style={{flex:1, marginTop:25, padding:20}}>
            {select === screens[0] && <Category setSelect={setSelect} setData={setData}/>}
            {select === screens[1] && <SubCategory setSelect={setSelect} setData={setData} data={data}/>}
            {select === screens[2] && <TextInputField label='Enter Name' heading='Your Name' onPress={()=>setSelect(screens[3])} setValue={(name)=>setData({...data, name})}/>}
            {select === screens[3] && <TextInputField label='Enter Address' onPress={_onSubmit} heading='Your Address' setValue={(address)=>setData({...data, address})} pressLabel='Submit'/>}
        </View>
    )
}

export default SignUp

const styles = StyleSheet.create({
    categoryContainer:{
        backgroundColor:color.elevatedDark,
        borderRadius:10,
        padding:10,
        marginBottom:20
    },
    activeSubCat:{
        backgroundColor:color.lightDark
    },
    next:{
        position:'absolute',
        bottom:-10,
        right:-10,
        flexDirection:'row',
        alignItems:'center',
        padding:10,
        justifyContent:'center'
    }
})
