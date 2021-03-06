import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import CONSTANT from './navigationConstant.json'
import HomeScreen from 'screen/main'
import LoadingScreen from 'screen/Loading'
import OrderProfileScreen from 'screen/OrderProfile'
import LoginScreen from 'screen/Auth/Login'
import SignUpScreen from 'screen/Auth/SignUp'

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

