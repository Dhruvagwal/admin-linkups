import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Image, Pressable, TextInput, BackHandler, KeyboardAvoidingView } from 'react-native'
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import SoundPlayer from 'react-native-sound-player'
import messageTemplate from 'data/messageTemplate'
import SpeechToText from 'react-native-google-speech-to-text';

import { Text, RowView } from 'styles'
import color from 'colors'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'
import useKeyboard from 'hooks/useKeyboard'
import { stat } from 'react-native-fs';
import { saveOrder, Message } from 'hooks/useData'
import { Snackbar } from 'react-native-paper';
import Camera from 'components/Camera'
import { DataConsumer } from 'context/data'
import { sendPushNotification } from 'middlewares/notification'
import storage from '@react-native-firebase/storage'

var chunk = require('lodash.chunk');
const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width


const getFileSize = async (uri) => {
    const { size } = await stat(uri);
    const extension = uri.slice(uri.length - 3, uri.length)
    return { size, extension }
};

const Problem = ({ setSuccess, setLoading, state, subCategory, data, category, navigation }) => {
    const [text, setText] = useState('')
    const [response, setResponse] = useState(state.url)
    const [fileData, setfileData] = useState()
    const [camera, setCamera] = useState(false)
    const { state: { profile } } = DataConsumer()
    const speechToTextHandler = async () => {

        let speechToTextData = null;
        try {
            speechToTextData = await SpeechToText.startSpeech('Try saying something', 'en_IN');
            setText(speechToTextData)

        } catch (error) {
            console.log('error: ', error);
        }
    }
    const _onPress = async () => {
        if (profile.coord) {
            setLoading(true)
            const id = 'ORD-' + Math.floor(Math.random() * 1000000)
            var url
            if (response) {
                await storage().ref(`orderImage/${id}`).putFile(response);
                url = await storage().ref(`orderImage/${id}`).getDownloadURL();
            }
            const DATA = {
                type: 'service',
                user: profile.id,
                info: { ...state, problem: text },
                status: 'posted',
                coord: profile.coord,
                Address: profile.Address,
                postedAt: new Date(),
                id,
                url
            }
            await saveOrder(DATA)

            const notifyDataFeed = {
                title: `${subCategory.name}`,
                body: text,
                id
            }
            data.map(({ token, id, name }) => {
                sendPushNotification(token, notifyDataFeed)
                Message({ phone: '+' + id, message: messageTemplate({ name, profile, subCategory, category }, 0) })
            })
            setSuccess(true)
            setTimeout(() => {
                try {
                    SoundPlayer.playSoundFile('success', 'mp3')
                } catch (err) { }
            }, 1300)
            try {
                setTimeout(async () => { 
                    RootNavigation.navigate(CONSTANT.OrderDescription, { id });
                    setSuccess(false); 
                }, 2500)
                setTimeout(async () => { 
                    setLoading(false)
                }, 3000)
            } catch (err) {
                RootNavigation.navigate(CONSTANT.Library, { id })
            }
        } else {
            RootNavigation.navigate(CONSTANT.Address)
        }
    }
    const active = useKeyboard()
    response && getFileSize(response).then(data => !fileData && setfileData(data))
    var reason = subCategory.problem ? subCategory.problem : subCategory.reason
    reason = chunk(reason, 2)
    if (camera) return <Camera setCamera={setCamera} setImage={setResponse} />
    else return <View style={{ flex: 1 }}>
            <View style={{ height: HEIGHT * .02 }} />
            <RowView style={{ marginLeft: 20 }}>
                <Pressable onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color={color.white} />
                </Pressable>
                <View style={{ marginVertical: 20, marginLeft: 10 }}>
                    <Text size={20} bold>Linkups</Text>
                    <Text size={13} regular>{subCategory.name}</Text>
                </View>
            </RowView>
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 20, flex: 1 }}>
                {!active && <>
                    {
                        reason.map(res =>
                            <RowView key={Math.random()}>
                                {res.map(item => <Pressable onPress={() => setText(item.id)} key={Math.random()} style={[styles.contentContainer, { justifyContent: 'center', flexDirection: 'column', width: reason.length >= 2 ? '50%' : '100%', marginRight: 5 }, item.id === text && { backgroundColor: color.blue, elevation: 5 }]}>
                                    <Image source={{ uri: item.url }} style={{ width: 50, height: 50 }} />
                                    <Text regular size={13}>{item.id}</Text>
                                </Pressable>)}
                            </RowView>
                        )
                    }
                </>}
                <View style={[styles.contentContainer, {
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: color.blue
                }]} android_ripple={{ color: color.dark }}>
                    <TextInput
                        placeholder="What's your Problem?"
                        value={text}
                        onChangeText={setText}
                        placeholderTextColor={color.white}
                        style={{
                            fontFamily: 'Montserrat-Regular',
                            textAlign: 'center',
                            flexGrow: 1,
                            fontSize: 15,
                            color: color.white,
                        }}
                        multiline
                    />
                    <Pressable style={{ position: 'absolute', right: 0, paddingHorizontal: 10 }} onPress={speechToTextHandler}>
                        <FontAwesome name="microphone" size={24} color={color.white} />
                    </Pressable>
                </View>
                {!active && <Pressable onPress={() => setCamera(true)} setResponse={setResponse} setLoading={() => { }} style={{ marginTop: 20, overflow: 'hidden', borderRadius: 10 }} uploadImage={false}>
                    {!response ? <View style={{ width: WIDTH - 40, height: 130, borderWidth: 2, borderColor: color.blue, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Entypo name="image" size={30} color={color.blue} />
                        <Text regular size={13} >Upload Image</Text>
                        <Text regular size={10} theme={color.inActive} >(Optional)</Text>
                    </View>
                        :
                        <Image resizeMode='center' style={{ width: WIDTH - 40, height: 130 }} source={{ uri: response }} />
                    }
                </Pressable>}
                <Text>{'\n'}</Text>
                <Pressable disabled={!text.length > 0} onPress={() => _onPress()} style={[styles.button, text.length <= 0 && { backgroundColor: color.inActive }]}>
                    <Text size={13} bold>Done</Text>
                </Pressable>
            </View>
        </ScrollView>
        <Snackbar onDismiss={() => { }} style={styles.Snackbar} visible={fileData && fileData.size / (1024 * 1024) > 10}>
            <Text regular>File size must be less than 10mb</Text>
        </Snackbar>
        <Snackbar onDismiss={() => { }} style={styles.Snackbar} visible={fileData && fileData.extension !== 'jpg' && 'png'}>
            <Text regular>Should support .png or .jpg format</Text>
        </Snackbar>
    </View>
}

export default Problem


const styles = StyleSheet.create({
    Button: {
        backgroundColor: color.active,
        position: 'absolute',
        bottom: 0,
        padding: 20,
        width: WIDTH,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentContainer: {
        backgroundColor: '#0000',
        marginVertical: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10
    },
    button: {
        backgroundColor: color.active,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        margin: 20,
        elevation: 5,
        width: WIDTH / 2,
        paddingVertical: 15
    },
    Snackbar: {
        backgroundColor: color.lightDark,
    }
})
