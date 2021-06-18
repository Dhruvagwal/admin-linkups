import React, {useEffect, useState} from 'react'
import { StyleSheet, View, TextInput, Pressable, Dimensions, Linking} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import Loading from 'components/Loading'
import {getDataById, saveData} from 'hooks/useData';
import color from 'colors';
import {DataConsumer} from 'context/data'
import LottieView from 'lottie-react-native';

const CustomTextInput = ({label, numberOfLines=1, problem, setProblem})=>{
    return <RowView style={styles.TextInput}>
        <TextInput
            placeholder={label}
            placeholderTextColor={color.inActive}
            style={styles.CustomTextInput}
            numberOfLines={numberOfLines}
            multiline
            value={problem}
            onChangeText={setProblem}
            textAlignVertical='top'
        />
    </RowView>
}

const HEIGHT = Dimensions.get('screen').height-100
const WIDTH = Dimensions.get('screen').width-100

const Help = ({navigation}) => {
    const [loading,setLoading] = useState(true)
    const [problemList,setProblemList] = useState({})
    const [problem, setProblem] = useState('')
    const [sucess, setSuccess] = useState(false)
    const [other, setOther] = useState(false)
    const {state:{profile}} = DataConsumer()
    const [care, setCare] = useState({})
    useEffect(()=>{
        getDataById('Linkups', 'LINKUPS_PROBLEM_FACE').then(({data})=>{setProblemList(data); setLoading(false)})
        getDataById('Linkups','care').then(({data})=>{setCare(data)})
    },[])
    const _onPress = async ()=>{
        setLoading(true)
        await saveData('problem',{
            id:Math.floor(Math.random()*10000000),
            problem,
            postedAt : new Date(),
            isSeller:false,
            complainId: profile.id

        })
        setSuccess(true)
        setLoading(false)
    }
    return (
            !loading ? <View style={{paddingTop:25, padding:20, flex:1}}>  
            {!sucess ? <>
                <View style={{marginVertical:50}}>
                    <Text size={25} bold>Help & Support</Text>
                </View>
                <View style={{flex:1}}>
                    {!other?<>
                    {
                        problemList.problems.map(item=><Pressable onPress={()=>{setProblem(item); item === 'Other' && setOther(true)}} key={item} style={[styles.problemList, problem===item && styles.active]}>
                            <Text bold>{item}</Text>
                        </Pressable>)
                    }
                    <View style={{margin:10}}>
                        <Pressable onPress={() => { Linking.openURL(`tel:${care.num}`) }}>
                            <Text size={13} regular>Customer Care: <Text theme={color.blue} bold>{care.num}</Text> </Text>
                        </Pressable>
                        <Pressable onPress={()=>{Linking.openURL(`mailto:${care.email}?subject=${profile.name}&body=`)}} style={{marginTop:10}}>
                            <Text size={13} regular>Email Id: <Text theme={color.blue} bold>{care.email}</Text></Text>
                        </Pressable>
                </View>
                    </>
                    :
                    <>
                    <CustomTextInput problem={problem} setProblem={setProblem} label='Problem Face' numberOfLines={5}/>
                    </>}
                    {problem!=='' && <Pressable onPress={_onPress} style={styles.Submit}>
                        <Text bold>Submit</Text>
                    </Pressable>}
                </View>    
                </>
                :
                <View style={{flex:1, alignItems:'center'}}>
                    <LottieView
                        source={require('../../../assets/lottieFiles/contact.json')}
                        style={{width:WIDTH, height:HEIGHT, position:'absolute'}}
                        autoPlay
                    />
                    <View style={{position:'absolute', bottom:100}}>
                        <Text theme={color.red} bold>Sorry For Your Inconvience,</Text>
                        <Text bold>Your Problem will be resolve within 24 Hour</Text>
                        <Text>Don't Worry! We are here for you</Text>
                    </View>
                </View>}
            </View>
            :
            <Loading/>
    )
}

export default Help

const styles = StyleSheet.create({
    TextInput:{
        borderColor:color.blue,
        borderWidth:0.5,
        borderRadius:5,
        width:'100%',
        marginVertical:10,

    },
    button:{
        backgroundColor:color.active,
        padding:10,
        borderRadius:5,
        alignItems:'center',
        alignSelf:'center',
        marginTop:20,
        width:'50%'
    },
    CustomTextInput:{
        fontSize:20,
        color:color.white,
        fontFamily:'Montserrat' ,
        width:'100%',
        padding:10,
    },
    problemList:{
        padding:10,
        borderBottomWidth:1,
        borderBottomColor:color.lightDark,
        borderRadius:10
    },
    active:{
        backgroundColor:color.blue,
    },
    Submit:{
        backgroundColor:color.active,
        position:'absolute',
        bottom:0,
        padding:10,
        borderRadius:10,
        alignSelf:'center'
    }
})
