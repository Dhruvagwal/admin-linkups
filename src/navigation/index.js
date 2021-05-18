import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import CONSTANT from './navigationConstant.json'
import HomeScreen from 'screen/main'
import LoadingScreen from 'screen/Loading'
import OrderProfileScreen from 'screen/OrderProfile'

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
                    <Stack.Screen name={CONSTANT.Home} component={HomeScreen}/>
                    {
                      auth && 
                      <>
                        <Stack.Screen name={CONSTANT.OrderProfile} component={OrderProfileScreen}/>
                      </>
                    }
                </Stack.Navigator>
            </NavigationContainer>
    )
}

export default Index

