import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Image } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'
import Loading from 'components/Loading'
import {getCategory} from 'hooks/useData'
import { Pressable } from 'react-native'

const screens = ['category', 'subCategory']

const Category = ({setSelect, setData})=>{
    const [category, setCategory] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        getCategory().then(({data})=>{setCategory(data); setLoading(false)})
    },[])
    const _onPress = (data)=>{
        setData({Category:data})
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
    console.log(data.subCategory)
    const _onPress = (item)=>{
        const subCategory = {
        }
        setData({...data,subCategory})
        setSelect(screens[1])
    }
    return <View>
        <Text style={{marginVertical:20}}>Choose Sub Category</Text>
        {
            data.Category.subCategory.map(item=><Pressable key={item.id} onPress={()=>_onPress(item.id)} android_ripple={{color:color.dark}} style={styles.categoryContainer}>
                    <RowView>
                    <Image source={{uri:item.url}} style={{height:70, width:70}}/>
                    <Text size={20} bold style={{marginLeft:10, width:'70%'}}>{item.name}</Text>
                </RowView>
                </Pressable>
            )
        }
    </View>
}

const SignUp = ({route}) => {
    const [select, setSelect] = useState(screens[0])
    const [data, setData] = useState({subCategory:[]})
    const {PhoneNumber} = route.params
    return (
        <View style={{flex:1, marginTop:25, padding:20}}>
            {select === screens[0] && <Category setSelect={setSelect} setData={setData}/>}
            {select === screens[1] && <SubCategory setSelect={setSelect} setData={setData} data={data}/>}
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
    }
})
