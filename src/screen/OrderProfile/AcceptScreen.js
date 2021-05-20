import React, {useState} from 'react'
import { View, Pressable } from 'react-native'
import {  Ionicons, AntDesign } from '@expo/vector-icons'; 

import {Text, RowView} from 'styles'
import color from 'colors'
import Calendar from 'components/calendar'
import ScreenModal from 'components/ScreenModal'
import styles from './stylesSheet'

import {updateOrder, updateProfile} from 'hooks/useData'
import { TextInput } from 'react-native-gesture-handler';

const AcceptScreen = ({setAccept, profile, data, Update})=>{
    const [date, setDate] =useState(new Date())
    const [time, setTime] =useState()
    const [price, setPrice] =useState()

    const Accept = async ()=>{
        const proposalData = {
            id:profile.id,
            date,
            time,
            price
        }
        const proposal = data.proposal === undefined ? [proposalData]:[...data.proposal,proposalData ]
        const invitation = data.invited.filter(item=>item!==profile.id)
        await updateOrder({proposal, invited:invitation}, data.id)
        await Update()
        setAccept(false)
    }

    return <ScreenModal style={{paddingHorizontal:0, paddingVertical:10}}>
        <View>
            <View>
                <Pressable style={{position:'absolute', right:10}} onPress={()=>setAccept(false)}>
                        <AntDesign name="close" size={24} color={color.white} />
                </Pressable>
                <Text style={{alignSelf:'center', marginBottom:20}} size={20} regular>Details</Text>
                <RowView style={styles.TextInput} >
                    <Text size={18} regular>₹</Text>
                    <TextInput 
                        placeholder='Price' 
                        style={{
                            marginLeft:5,
                            fontSize:18,
                            fontFamily:'Montserrat-Regular',
                            width:150,
                            color:color.white
                        }}
                        placeholderTextColor={color.white}
                        keyboardType='number-pad'
                        onChangeText={setPrice}
                    />
                </RowView>
            </View>
            <Text style={{marginLeft:10, marginTop:20}} size={12}>Delieverd on</Text>
            <Calendar date={date} setDate={setDate} time={time} setTime={setTime}/>
            <Pressable onPress={Accept} style={styles.button}>
                <RowView>
                    <Text regular>Send </Text>
                    <Ionicons name="send" size={24} color={color.white} />
                </RowView>
            </Pressable>
        </View>
    </ScreenModal>
}
export default AcceptScreen
