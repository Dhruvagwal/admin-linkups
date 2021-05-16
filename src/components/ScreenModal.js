import React, { Children, useRef, useEffect } from 'react'
import {StyleSheet, View, Dimensions, Animated, StatusBar } from 'react-native'

import Modal from 'react-native-modal';


import color from 'colors'
import {Text} from 'styles'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width
const ScreenModal = ({children, style}) => {
    return (
            <Modal backdropOpacity={0.5} isVisible animationIn='zoomIn'>
                <StatusBar backgroundColor='rgba(0, 0, 0,0.5)' />
                <View style={[styles.container, style]}>
                    {children}
                </View>
            </Modal>
    )
}

export default ScreenModal


const styles = StyleSheet.create({
    container:{
        backgroundColor: color.elevatedDark,
        borderRadius:20,
        padding:20,
        elevation:5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1, 
    }
})