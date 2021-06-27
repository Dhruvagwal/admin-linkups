import React, {useState} from 'react'
import { Dimensions, StyleSheet, View, Pressable } from 'react-native'

import {Text, RowView} from 'styles'
import TextInput from 'components/TextInput'
import {DataConsumer} from 'context/data'
import Loading from 'components/Loading'
import color from 'colors'
import { saveData } from 'hooks/useData'
import { Ionicons, FontAwesome } from '@expo/vector-icons'; 
import LottieView from 'lottie-react-native'
import SpeechToText from 'react-native-google-speech-to-text';

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width


const Suggestion = ({navigation}) => {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { state:{profile} } = DataConsumer()
    const _onPress = ()=>{
        const data={
            id:Math.round(Math.random()*100000),
            sender:profile.id,
            suggestion:text,
            type:'pro'
        }
        setLoading(true)
        saveData('Suggestion',data)
        setSuccess(true)
        setTimeout(navigation.goBack,1500)
    }
    const speechToTextHandler = async () => {
 
        let speechToTextData = null;
            try {
                speechToTextData = await SpeechToText.startSpeech('Try saying something', 'en_IN');
                setText(speechToTextData)
     
            } catch (error) {
                console.log('error: ', error);
            }
    }

    if (success){
        return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <LottieView
                source={require('../../../assets/lottieFiles/thanks.json')}
                autoPlay
            />
            <View style={{position:'absolute', bottom:20, alignItems:'center'}}>
                <Text theme={color.blue} bold>Thank's for think about us</Text>
                <Text regular size={13} style={{textAlign:'center'}}>We will review your suggestion{'\n'}and Try to apply it.</Text>
            </View>
        </View>
    }
    else return (
        <View style={{flex:1, justifyContent:'center', padding:20, marginTop:50}}>
            <View style={{position: 'absolute',top:0,padding:20, }}>
                <Text bold size={13}>Give a chance to improve ourselves</Text>
            </View>
            <View>
                <TextInput value={text} setValue={setText} line={5} label='Suggestion'/>
                <Pressable onPress={speechToTextHandler} style={{position: 'absolute', right:0, padding:20, bottom:0}}>
                    <FontAwesome name="microphone" size={24} color={color.blue} />
                </Pressable>
            </View>
            <View style={{marginTop:loading?10:0}}>
                {!loading?<Pressable disabled={text.length===0} onPress={_onPress} style={[styles.button, text.length===0 && {backgroundColor:color.inActive}]}>
                    <Text regular style={{marginRight:5}}>Send</Text>
                    <Ionicons name="send" size={24} color={color.white} />
                </Pressable>:
                <Loading whole={false}/>}
            </View>
        </View>
    )
}

export default Suggestion

const styles = StyleSheet.create({
    button:{
        backgroundColor:color.blue,
        elevation:5,
        padding:10,
        alignItems:'center',
        justifyContent:'center',
        width:'45%', 
        alignSelf:'center',
        borderRadius:10,
        marginTop:20,
        flexDirection:'row'
    }
})
