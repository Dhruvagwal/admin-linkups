import React, {useState} from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import LottieView from 'lottie-react-native'

import {Text, RowView} from 'styles'
import color from 'colors'
import ScreenModal from 'components/ScreenModal'
import Loading from 'components/Loading'
import {updateProviderProfile} from 'hooks/useData'
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant'

const ICON_SIZE = 70
const ReviewView = ({source, text='', active, setActive, id})=><Pressable 
    onPress={()=>setActive(id)}
    style={{alignItems:'center', height: 120,}}
    >
    <LottieView
        source={source}
        autoPlay
        style={styles.review}
    />
    <Text size={13} regular>{text}</Text>
    {active === id && <View style={{padding:5 ,borderRadius:100, backgroundColor: color.active, marginTop:10}}/>}
</Pressable>
const FeedBack = ({data, provider}) => {
    const Rating = [1,2,3,4]
    const [active, setActive] =useState()
    const [text, setText] = useState()
    const [loading, setLoading] = useState(false)

    const Submit=async ()=>{
        setLoading(true)
        const FeedBackData = {id:data.user, rating:active, review:text}
        const rating = provider.rating === undefined ? [FeedBackData] : [...provider.rating,FeedBackData ]
        await updateProviderProfile(provider.id,{rating})
        RootNavigation.navigate(CONSTANT.Library, {load:true})
        setLoading(false)
    }

    
    return (
        <ScreenModal>
            <Text style={{marginBottom:10}}>FeedBack</Text>
            <RowView style={{justifyContent: 'space-between',}}>
                <ReviewView id={Rating[0]} active={active} setActive={setActive} text='Angry' source={require('../../../assets/review/angry.json')}/>
                <ReviewView id={Rating[1]} active={active} setActive={setActive} text='Poor' source={require('../../../assets/review/no.json')}/>
                <ReviewView id={Rating[2]} active={active} setActive={setActive} text='Average' source={require('../../../assets/review/blink.json')}/>
                <ReviewView id={Rating[3]} active={active} setActive={setActive} text='Happy' source={require('../../../assets/review/yep.json')}/>
            </RowView>
            <TextInput
                placeholder='Say Something...'
                style={styles.TextInput}
                numberOfLines={5}
                placeholderTextColor={color.inActive}
                multiline
                textAlignVertical='top'
                onChangeText={setText}
                value={text}
            />
            {!loading?<Pressable onPress={Submit} style={{backgroundColor: color.active, alignSelf:'flex-end', padding:10, borderRadius:10}}>
                <Text regular>Submit</Text>
            </Pressable>:
            <Loading whole={false}/>}
        </ScreenModal>
    )
}

export default FeedBack

const styles = StyleSheet.create({
    review:{
        height:ICON_SIZE,
        width:ICON_SIZE
    },
    TextInput:{
        fontFamily:'Montserrat-Regular',
        fontSize:16,
        borderWidth:1,
        marginVertical:10,
        borderColor:color.inActive,
        padding:10,
        borderRadius:10,
        marginTop:20,
        color:color.white,
    }
})
