import React from 'react'
import { StyleSheet, Text} from 'react-native'

import { View } from 'moti'
import {RowView} from 'styles'
import color from 'colors'

const Loading = () => {
    return (
        <RowView style={{flex:1, alignSelf: 'center'}}>
            {[1,2,3].map(item=><View
            key={item}
            from={{
                translateY: -10,
            }}
            animate={{
                translateY: 10,
            }}
            transition={{
                loop: true,
                type: 'spring',
                duration: 100,
                delay: item*100,
            }}
            style={styles.shape}
            />)}
        </RowView>
    )
}

export default Loading

const styles = StyleSheet.create({
    shape:{
        padding:10,
        borderRadius:100,
        backgroundColor:color.active,
        width:5,
        margin:10
    }
})
