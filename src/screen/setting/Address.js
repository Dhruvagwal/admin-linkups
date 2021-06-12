import React, {useState} from 'react'
import { StyleSheet, View, Dimensions, Pressable } from 'react-native'
import color from 'colors'
import {DataConsumer} from 'context/data'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {Text, RowView} from 'styles'
import { Ionicons } from '@expo/vector-icons'; 
import Loading from 'components/Loading'
import {updateUserProfile} from 'hooks/useData'
import useCurrentLocation from 'hooks/useCurrentLocation'
import Geocoder from 'react-native-geocoding';

const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height

const API_KEY = 'AIzaSyBuIDCj_Z4ilAQHM_ogrDEPBdg27PTEZ9A'
Geocoder.init(API_KEY);

const GooglePlaceAutoComplete = ({onGet})=>{
    return <GooglePlacesAutocomplete
                    placeholder='Enter Address'
                    minLength={2}
                    textInputProps={{ placeholderTextColor: color.white}}
                    styles={{
                        textInput:{
                          backgroundColor:color.dark,
                          color:color.white,
                          opacity: 0.9,
                          borderColor:color.blue,
                          borderWidth:1,
                          borderRadius:10,
                          fontFamily:'Montserrat-Regular',
                          marginTop:10
                        },
                        container:{
                            marginHorizontal:10
                        },
                        row:{
                          backgroundColor:color.elevatedDark,
                          borderRadius:0,
                          marginTop:1,
                          opacity: 0.8,
                        },
                        description:{
                          color:color.white,
                          fontFamily:'Montserrat-Regular',
                        },
                        loader:{
                          color:color.active
                        }
                    }}
                    onPress={(data, details = null) => {
                        onGet(data, details)
                    }}
                    nearbyPlacesAPI='GooglePlacesSearch'
                    enablePoweredByContainer={false}
                    query={{
                      language: 'en',
                      key: API_KEY,
                      components: 'country:ind',
                      
                    }}
      />
}

const BackGround = ()=>{
    return <View style={[{flex:1, flexDirection:'row'},StyleSheet.absoluteFillObject]}>
        <View style={{backgroundColor:color.secondaryDark,height:1000, width:600,transform:[{rotate:'45deg'}, {translateY:-100},{translateX:200}]}}/>
    </View>
}

const Address = () => {
    const {state:{profile}, Update} = DataConsumer()
    const [loading, setLoading] = useState(false)
    const [change, setChange] = useState(false)
    const onGet = (data, details)=>{
        setLoading(true)
        Geocoder.from(data.description)
		.then(async json => {
            var {lat, lng} = json.results[0].geometry.location;
            await updateUserProfile({Address:data.description, coord:{latitude:lat, longitude:lng}})
            await Update()
            setLoading(false)
            setChange(false)
		})
		.catch(error => console.warn(error));
    }
    const CurrentLocation = async ()=>{
        setLoading(true)
        const {coords:{latitude, longitude}} = await useCurrentLocation()
        const location = await Geocoder.from({latitude,longitude});
        const Address = location.results[0].formatted_address
        if (location.status === "OK" && Address!==profile.Address){
            await updateUserProfile({Address, coord:{latitude, longitude}})
            await Update()
        }
        setLoading(false)
        
    }
    return (
        !loading ? <View style={styles.container}>
            <BackGround/>
            {!change? 
            <>
            <View style={{flex:1,justifyContent:'center'}}>
                <Pressable onPress={()=>setChange(true)} style={styles.button}>
                    <Text bold>Edit Address</Text>
                </Pressable>
                <Pressable onPress={CurrentLocation} style={styles.button}>
                    <Text bold>Current Location</Text>
                </Pressable>
            </View>
            <View style={{padding:10, backgroundColor:color.lightDark, borderTopLeftRadius:10, borderTopRightRadius:10, paddingVertical:20}}>
                <Text size={13}>Your Address:</Text>
                <Text bold>{profile.Address}</Text>
            </View>
            </>
            :
            <View style={{flex:1}}>
            <Pressable onPress={()=>setChange(false)} style={{padding:5, alignSelf:'flex-start'}} android_ripple={{color:color.lightDark}}>
                <Ionicons name="chevron-back" size={24} color={color.inActive} />
            </Pressable>
            <GooglePlaceAutoComplete onGet={onGet}/>
            </View>
            }
        </View>
        :
        <Loading/>
    )
}

export default Address

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:50,
    },
    button:{
        backgroundColor:color.blue, 
        borderRadius:10, 
        alignSelf:'center', 
        padding:10, 
        margin:10,
        width:WIDTH/2,
        alignItems:'center',
        justifyContent:'center'
    }
})
