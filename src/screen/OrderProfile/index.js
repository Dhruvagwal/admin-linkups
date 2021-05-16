import React from 'react'
import { StyleSheet, Dimensions, View } from 'react-native'

import {Text, RowView} from 'styles'
import color from 'colors'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const Index = () => {
    return (
        <View style={{flex:1, paddingTop:HEIGHT*.05, padding: 20,}}>
            <View>
                <Text>Check</Text>
            </View>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({})
