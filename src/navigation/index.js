import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import CONSTANT from './navigationConstant.json'
import HomeScreen from 'screen/main'
import LoadingScreen from 'screen/Loading'
import OrderProfileScreen from 'screen/OrderProfile'
import ConnectsScreen from 'screen/connects'
import LoginScreen from 'screen/Auth/Login'
import SignUpScreen from 'screen/Auth/SignUp'
import SettingScreen from 'screen/setting'
import AddressScreen from 'screen/setting/Address'
import HelpScreen from 'screen/setting/Help'

import {navigationRef} from './RootNavigation';
import {AuthConsumer} from '../context/auth'
import { verifyToken } from '../hooks/useAuth'

import color from 'colors'

const Index = () => {
  const Stack = createStackNavigator()
  const [Loading, setLoading] = useState(true)
  const {state:{auth}, setAuth} = AuthConsumer()

  useEffect(()=>{
    verifyToken()
      .then(response=>{setAuth(response); setLoading(false)})
      .catch(err=>setAuth(false))

    return ()=>{}
  },[])

    const BlackTheme = {
        dark: true,
        colors: {
          background: color.dark,
        },
      };

    return (<NavigationContainer 
                    ref={navigationRef} 
                    theme={BlackTheme}
                >
                <Stack.Navigator headerMode={false} screenOptions={{ animationEnabled: false }} >
                    {Loading && <Stack.Screen name={CONSTANT.Loading} component={LoadingScreen}/>}
                    {
                      auth ?
                      <>
                        <Stack.Screen name={CONSTANT.Home} component={HomeScreen}/>
                        <Stack.Screen name={CONSTANT.OrderProfile} component={OrderProfileScreen}/>
                        <Stack.Screen name={CONSTANT.Connects} component={ConnectsScreen}/>
                        <Stack.Screen name={CONSTANT.Setting} component={SettingScreen}/>
                        <Stack.Screen name={CONSTANT.Address} component={AddressScreen}/>
                        <Stack.Screen name={CONSTANT.Help} component={HelpScreen}/>
                      </>
                      :
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

