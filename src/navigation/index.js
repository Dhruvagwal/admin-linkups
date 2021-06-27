import React, {useEffect, useState} from 'react'
import { View, Pressable, BackHandler } from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import axios from 'axios'
import {useNetInfo} from "@react-native-community/netinfo";

import CONSTANT from './navigationConstant.json'
import HomeScreen from 'screen/main'
import { Text, RowView } from 'styles'
import Loading from 'components/Loading'

import LanguageScreen from 'screen/setting/language'
import AddOrderScreen from 'screen/order/AddOrder'
import OrderDescriptionScreen from 'screen/order/OrderDescription'
import ServiceProfileScreen from 'screen/profile/ServiceProfile'
import SettingScreen from 'screen/setting'
import LibraryScreen from 'screen/Library'
import AddressScreen from 'screen/setting/Address'
import HelpScreen from 'screen/setting/Help'
import SuggestionScreen from 'screen/setting/Suggestion'
import {getDataById} from 'hooks/useData'

import {navigationRef} from './RootNavigation';
import {AuthConsumer} from '../context/auth'
import {DataConsumer} from '../context/data'
import { verifyToken } from '../hooks/useAuth'
import LoginScreen from 'screen/Auth/Login'
import SignUpScreen from 'screen/Auth/SignUp'

import color from 'colors'
const routeNameRef = React.createRef();

const Index = () => {

    useEffect(()=>{
      verifyToken()
        .then(response=>{setAuth(response)})
        .catch(()=>setAuth(false))
      getDataById('Linkups','care').then(({data:{update}})=>setIsUpdate(update))
      setTimeout(()=>{setLoading(false)},1000)
      
    },[])

    const Stack = createStackNavigator()
    const netInfo = useNetInfo();
    const {setName} = DataConsumer()
    const [loading, setLoading] = useState(true)
    const [isUpdate, setIsUpdate] = useState(false)
    const {state:{auth}, setAuth} = AuthConsumer()

    const BlackTheme = {
        dark: true,
        colors: {
          background: color.dark,
        },
      };

    const linking = {
      prefixes:['https://www.linkups.com','linkups://'],
      config:{
        Main:'home',
        OrderDescription:{
          path:'order/:id',
          params:{
            id:null
          }
        }

      }
    }
    if(loading) return  <Loading/>
    else if(!netInfo.isConnected && !loading){
      return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <View style={{backgroundColor:color.lightDark, width:'80%', height:150, borderRadius:10, padding:10, elevation:5}}>
          <Text bold theme={color.red} numberOfLines={1} adjustsFontSizeToFit>Internet might not be available</Text>
          <Text style={{marginTop:5}} size={13} regular>Please Check your wifi connection or turn on mobile data</Text>
          <Pressable onPress={()=>BackHandler.exitApp()} android_ripple={{color:color.dark}} style={{position:'absolute', bottom:10, right:10, padding:10}}>
            <Text regular>OK</Text>
          </Pressable>
        </View>
      </View>
    }
    else if(isUpdate){
      return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <View style={{backgroundColor:color.lightDark, width:'80%', height:150, borderRadius:10, padding:10, elevation:5}}>
          <Text bold numberOfLines={1} theme={color.blue} adjustsFontSizeToFit>Stay Up-to-update</Text>
          <Text style={{marginTop:5}} size={13} regular>Please Update our app for seamless experience</Text>
          <Pressable onPress={()=>{}} android_ripple={{color:color.dark}} style={{position:'absolute', bottom:10, right:10, padding:10}}>
            <Text regular>OK</Text>
          </Pressable>
        </View>
      </View>
    }
    else return (<NavigationContainer 
                    ref={navigationRef} 
                    onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
                    onStateChange={async () => {
                        const name = await navigationRef.current.getCurrentRoute().name
                        setName(name)
                    }} 
                    theme={BlackTheme}
                    linking={linking}
                >
                <Stack.Navigator headerMode={false} screenOptions={{ animationEnabled: false }} >
                    {auth ? <>
                      <Stack.Screen name={CONSTANT.Home} component={HomeScreen}/>
                      <Stack.Screen name={CONSTANT.Language} component={LanguageScreen}/>
                      <Stack.Screen name={CONSTANT.OrderDescription} component={OrderDescriptionScreen}/>
                      <Stack.Screen name={CONSTANT.AddOrder} component={AddOrderScreen}/>
                      <Stack.Screen name={CONSTANT.ServiceProfile} component={ServiceProfileScreen}/>
                      <Stack.Screen name={CONSTANT.Setting} component={SettingScreen}/>
                      <Stack.Screen name={CONSTANT.Library} component={LibraryScreen}/>
                      <Stack.Screen name={CONSTANT.Suggestion} component={SuggestionScreen}/>
                      <Stack.Screen name={CONSTANT.Address} component={AddressScreen}/>
                      <Stack.Screen name={CONSTANT.Help} component={HelpScreen}/>
                    </>:
                      <>
                      <Stack.Screen name={CONSTANT.Login} component={LoginScreen}/>
                      <Stack.Screen name={CONSTANT.SignUp} component={SignUpScreen}/>
                    </>
                    }
                </Stack.Navigator>
            </NavigationContainer>
    )
}

export default Index

