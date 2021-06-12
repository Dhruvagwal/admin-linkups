import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ImageView from "react-native-image-viewing";
import color from 'colors'
 
const ImageViewer = ({showImage=true, setShowImage=()=>{}, uri}) => {
    return (
        <View style={{flex:1}}>
            <Text>Dhruv</Text> 
            <ImageView
            images={[{uri}]}
            imageIndex={0}
            visible={showImage}
            onRequestClose={() => setShowImage(false)}
            backgroundColor={color.dark}
            />
        </View>
    )
}

export default ImageViewer

const styles = StyleSheet.create({})
