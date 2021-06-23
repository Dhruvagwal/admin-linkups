import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import SpeechToText from 'react-native-google-speech-to-text';

const speechToTextHandler = async () => {
 
  let speechToTextData = null;
      try {
          speechToTextData = await SpeechToText.startSpeech('Try saying something', 'en_IN');
          console.log('speechToTextData: ', speechToTextData);

      } catch (error) {
          console.log('error: ', error);
      }
}

const Speech = () => {
  return (
    <View>
      <Button title='listen' onPress={speechToTextHandler}/>
    </View>
  )
}

export default Speech

const styles = StyleSheet.create({})
