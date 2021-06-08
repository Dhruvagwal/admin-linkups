import React, {useState} from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

import {Text} from 'styles'
import color from 'colors'

const App = ({label='', keyboardType='default', setValue=()=>{}, value}) => {
    const [focused, setFocused] = useState(false)
    return (
        <View>
            <View style={styles.label}>
                <Text size={13} style={{color:!focused ? color.inActive : color.blue}} regular>{label}</Text>
            </View>
            <TextInput  autoFocus value={value} onChangeText={setValue} keyboardType={keyboardType} onFocus = {()=>setFocused(true)} style={[styles.TextInput, focused && {borderColor:color.blue}]}/>
        </View>
    )
}

export default App

const styles = StyleSheet.create({
    TextInput:{
        borderColor:color.inActive,
        borderWidth:1,
        padding:10,
        borderRadius:10,
        fontFamily:'Montserrat-Regular',
        color:color.white,
        fontSize:20,
        paddingHorizontal: 15,
        letterSpacing:1.5,
        textAlign:'center'
    },
    label:{
        position:'absolute',
        backgroundColor:color.dark,
        top:-10,
        paddingHorizontal:5,
        zIndex:100,
        alignSelf:'center'
    }
})
