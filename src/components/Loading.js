import React from 'react'
import { StyleSheet, Text} from 'react-native'

import { View } from 'moti'
import LottieView from 'lottie-react-native'

const Loading = ({whole=true}) => {
    return (
        <View style={[{alignItems:'center', justifyContent:'center'},whole && {flex:1}]}>
        <LottieView
            autoPlay
            source={require('../../assets/lottieFiles/loading2.json')}
            style={styles.loader}
        />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    loader:{
        width:100,
        height:100,
        alignSelf:'center',

    }
})
