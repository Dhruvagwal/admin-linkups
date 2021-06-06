import React, {useState, useEffect} from 'react'
import {Text as RNText, View as RNView, Image} from 'react-native'
import color from 'colors'

const Text = ({children, style, bold=false,regular=false, size=15, adjustsFontSizeToFit=false, numberOfLines=10000, theme=color.white})=>{
    let font = 'Montserrat'
    if (bold) font=('Montserrat-Bold')
    if (regular) font=('Montserrat-Regular')

    return <RNText style={{color:theme,fontSize:size, fontFamily:font, ...style}} numberOfLines={numberOfLines} adjustsFontSizeToFit={adjustsFontSizeToFit}>{children}</RNText>
}

const RowView = ({children, style})=><RNView style={{flexDirection:'row',alignItems:'center',...style}}>{children}</RNView>

export {Text, RowView}