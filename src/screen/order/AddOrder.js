import React, {Children, useState} from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Image, Pressable, TextInput} from 'react-native'
import { MaterialIcons, Entypo, AntDesign, Feather } from '@expo/vector-icons';

import ImagePicker from 'components/ImagePicker'

import {Text, RowView} from 'styles'
import color from 'colors'
import ScreenModal from 'components/ScreenModal'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'


const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const Background = ()=>{
    return <View style={[{flex:1},StyleSheet.absoluteFillObject]}>
        <View style={[{flex:1, alignItems:'stretch',flexDirection:'row', backgroundColor:color.dark, height:HEIGHT},StyleSheet.absoluteFillObject]}/>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:400,transform:[{rotate:'45deg'}, {translateY:-100}]}}/>
    </View>
}

const ScreenAddCategoryModal = ({visible, setCategory, text, call})=>{
    const ImageURI =['https://www.tws.edu/wp-content/uploads/2017/08/electrician-job-skills-1616x674.jpg','https://www.capecodapplianceservice.com/wp-content/uploads/2016/11/home-appliance-repair.jpg']
    return <ScreenModal>
        <Text>{text}</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={{marginTop:20}}>
            {[0,1].map(item=><Pressable onPress={()=>setCategory(call)} key={item} style={styles.listView}>
                <Image source={{uri:ImageURI[item]}} style={StyleSheet.absoluteFillObject} blurRadius={2}/>
                <View style={styles.containContainer}>
                    <Text bold size={20}>{call}</Text>
                </View>
            </Pressable>)}
        </ScrollView>
    </ScreenModal>
}

const TextActive = ({active, setActive, children})=><Pressable onPress={()=>setActive(undefined)} style={{marginBottom:10}}>
    <RowView style={styles.TextActive}>
        <RowView>
            {children}
            <Text style={{marginLeft:10}}>{active}</Text>
        </RowView>
        <MaterialIcons name="arrow-drop-down" size={30} color={color.white} />
    </RowView>
</Pressable>

const TimingSlot = ({visible, setTiming})=>{
    const timingSlot = ['12:00 Pm to 3:00 Pm', '3:00 Pm to 6:00 Pm', '6:00 Pm to 9:00 Pm', '9:00 Pm to 12:00 Am' ]
    return <ScreenModal>
        <Text>Choose Timing</Text>
        {
            timingSlot.map(item=><Pressable onPress={()=>setTiming(item)} key={item} style={styles.timing}>
                <Text>{item}</Text>
            </Pressable>)
        }
    </ScreenModal>
}

const Problem = ({visible, setProblem})=>{
    const problem = ['Burning Smell', 'I Don\'t know', 'Short Circuit', 'Disconnect']
    return <ScreenModal>
        <Text>What's Problem</Text>
        {
            problem.map(item=><Pressable onPress={()=>setProblem(item)} key={item} style={styles.timing}>
                <Text>{item}</Text>
            </Pressable>)
        }
    </ScreenModal>
}

const AddOrder = () => {
    const [category, setCategory] = useState()
    const [Subcategory, setSubCategory] = useState()
    const [timing, setTiming] = useState()
    const [problem, setProblem] = useState()
    return (
        <View style={{flex:1}}>
            <Background/>
            { timing===undefined && <TimingSlot setTiming={setTiming} visible={timing}/>}
            { problem === undefined && <Problem visible={problem} setProblem={setProblem}/>}
            { Subcategory === undefined && <ScreenAddCategoryModal call='Washing Machine' setCategory={setSubCategory} text={'Choose Services'} visible={Subcategory}/>}
            { category === undefined && <ScreenAddCategoryModal call='Electrician' setCategory={setCategory} text={'Choose Service Category'} visible={category}/>}
            <View style={{height:HEIGHT*.05}}/>
            <View style={{margin:20}}>
                <Text size={30} bold>Linkups</Text>
                <Text>Post Order</Text>
            </View>
            <View style={{margin:20}}>
                <TextActive active={category} setActive={setCategory}>
                    <AntDesign name="customerservice" size={24} color={color.inActive} />
                </TextActive>
                <TextActive active={Subcategory} setActive={setSubCategory}>
                    <MaterialIcons name="category" size={24} color={color.inActive} />
                </TextActive>
                <TextActive active={timing} setActive={setTiming}>
                    <Entypo name="time-slot" size={20} color={color.inActive} />
                </TextActive>
                <TextActive active={problem} setActive={setProblem}>
                    <MaterialIcons name="report-problem" size={24} color={color.inActive} />
                </TextActive>
                <ImagePicker style={{...styles.TextActive, alignItems:'center', justifyContent:'center', paddingLeft:10}}>
                    <RowView>
                        <Feather name="upload" size={30} color={color.active} />
                        <Text style={{marginLeft:10}}>Upload Image</Text>
                    </RowView>
                </ImagePicker>
            </View>
            <Pressable style={styles.Button} onPress={()=>RootNavigation.navigate(CONSTANT.Invitation)}>
                <Text regular>Save</Text>
            </Pressable>
        </View>
    )
}

export default AddOrder

const styles = StyleSheet.create({
    listView:{
        marginBottom:10,
        borderRadius:20,
        overflow:'hidden',
        height:100
    },
    containContainer:{
        width:'100%',
        height: '100%',
        backgroundColor:'rgba(34, 42, 56,0.3)',
        justifyContent:'center',
        alignItems:'center'
    },
    TextActive:{
        backgroundColor: 'rgba(40, 49, 64,0.7)',
        padding:10,
        borderRadius:10,
        paddingLeft: 20,
        height:100,
        justifyContent:'space-between'
    },
    timing:{
        backgroundColor: color.lightDark,
        padding: 10,
        marginVertical:10,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center'
    },
    Button:{
        backgroundColor: color.active,
        position:'absolute',
        bottom:0,
        padding: 20,
        width:WIDTH,
        alignItems:'center',
        justifyContent:'center'
    },
    OkayButton:{
        backgroundColor: color.active,
        padding: 10,
        width:80,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:20,
        right: 20,
    }
})
