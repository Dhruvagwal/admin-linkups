import React, {useState} from 'react'
import { View, Pressable } from 'react-native'
import {  Ionicons, AntDesign } from '@expo/vector-icons'; 
import {DataConsumer} from 'context/data'
import Loading from 'components/Loading'

import {Text, RowView} from 'styles'
import color from 'colors'
import Calendar from 'components/calendar'
import ScreenModal from 'components/ScreenModal'
import styles from './stylesSheet'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant.json'
import { sendPushNotification } from 'middlewares/notification'
import List from 'data/HomeNavigation'
import {updateOrder, updateProfile} from 'hooks/useData'
import { TextInput } from 'react-native-gesture-handler';

const AcceptScreen = ({setAccept, data, Update, userToken='', SubCat})=>{
    const {state:{profile}} = DataConsumer()
    const [date, setDate] =useState(new Date())
    const [time, setTime] =useState()
    const [price, setPrice] =useState()
    const [loading, setLoading] = useState(false)

    const Accept = async ()=>{
        setLoading(true)
        const proposalData = {
            id:profile.id,
            date,
            time,
            price,
            postedDate : new Date()
        }
        const notifyData = {
            title:`Got New Proposal`,
            body:`${profile.name} has sent you an Proposal`,
        }
        const dataAdd = {id:data.id, time: new Date(), type:'sell', amount:SubCat.charge}
        const history = profile.history!==undefined ? [...profile.history, dataAdd] : [dataAdd]
        const proposal = data.proposal === undefined ? [proposalData]:[...data.proposal,proposalData ]
        const invitation = data.invited.filter(item=>item!==profile.id)
        await updateOrder({proposal, invited:invitation}, data.id)
        await updateProfile({wallet: profile.wallet - SubCat.charge, history})
        sendPushNotification(userToken, notifyData)
        await Update()
        RootNavigation.navigate(CONSTANT.Home,{navigate:List[1]})
        setAccept(false)
        setLoading(false)
    }

    return <ScreenModal style={{paddingHorizontal:0, paddingVertical:10}}>
        <View>
            <View>
                <Pressable style={{position:'absolute', right:20, top:10}} onPress={()=>setAccept(false)}>
                        <AntDesign name="close" size={24} color={color.inActive} />
                </Pressable>
                <Text style={{margin:10, alignSelf: 'center',}} size={18} bold>Proposal</Text>
                <Text regular style={{alignSelf:'center', color:color.blue}}>Available Balance ₹{profile.wallet}</Text>
                <Text regular style={{alignSelf:'center', color:color.blue}}>Require ₹{SubCat.charge}</Text>
                <Text bold style={{alignSelf:'center'}}></Text>
                <RowView style={styles.TextInput} >
                    <Text size={18} regular>₹</Text>
                    <TextInput 
                        placeholder='0' 
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
            {!loading ? <Pressable onPress={Accept} style={styles.button}>
                <RowView>
                    <Text regular>Send </Text>
                    <Ionicons name="send" size={24} color={color.white} />
                </RowView>
            </Pressable>:
            <View>
                <Loading whole={false}/>
            </View>
            }
        </View>
    </ScreenModal>
}
export default AcceptScreen
