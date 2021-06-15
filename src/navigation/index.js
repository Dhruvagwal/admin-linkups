import React, {useEffect, useState, useRef} from 'react'
import {NavigationContainer, DefaultTheme} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import axios from 'axios'

import CONSTANT from './navigationConstant.json'
import HomeScreen from 'screen/main'
import LoadingScreen from 'screen/Loading'
import LanguageScreen from 'screen/setting/language'
import AddOrderScreen from 'screen/order/AddOrder'
import OrderDescriptionScreen from 'screen/order/OrderDescription'
import ServiceProfileScreen from 'screen/profile/ServiceProfile'
import SettingScreen from 'screen/setting'
import LibraryScreen from 'screen/Library'
import AddressScreen from 'screen/setting/Address'
import HelpScreen from 'screen/setting/Help'

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
      .then(response=>{setAuth(response); setLoading(false)})
      .catch(()=>setAuth(false))
  },[])
    const Stack = createStackNavigator()
    const [Loading, setLoading] = useState(true)
    const {setName} = DataConsumer()
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
    return (<NavigationContainer 
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
                    {Loading && <Stack.Screen name={CONSTANT.Loading} component={LoadingScreen}/>}
                    {auth ? <>
                      <Stack.Screen name={CONSTANT.Home} component={HomeScreen}/>
                      <Stack.Screen name={CONSTANT.Language} component={LanguageScreen}/>
                      <Stack.Screen name={CONSTANT.OrderDescription} component={OrderDescriptionScreen}/>
                      <Stack.Screen name={CONSTANT.AddOrder} component={AddOrderScreen}/>
                      <Stack.Screen name={CONSTANT.ServiceProfile} component={ServiceProfileScreen}/>
                      <Stack.Screen name={CONSTANT.Setting} component={SettingScreen}/>
                      <Stack.Screen name={CONSTANT.Library} component={LibraryScreen}/>
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

