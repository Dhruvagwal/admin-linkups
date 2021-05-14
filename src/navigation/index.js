import React, {useEffect, useState} from 'react'
import {NavigationContainer, DefaultTheme} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import CONSTANT from './navigationConstant.json'
import HomeScreen from 'screen/main'
import LoadingScreen from 'screen/Loading'

import {navigationRef} from './RootNavigation';

import color from 'colors'

const Index = () => {
    const Stack = createStackNavigator()
    
    const [Loading, setLoading] = useState(false)

    const BlackTheme = {
        dark: true,
        colors: {
          background: color.dark,
        },
      };

    return (<NavigationContainer 
                    ref={navigationRef} 
                    theme={BlackTheme}
                    screenOptions={{ animationEnabled: false }}     
                >
                <Stack.Navigator headerMode={false}>
                    {Loading && <Stack.Screen name={CONSTANT.Loading} component={LoadingScreen}/>}
                    <Stack.Screen name={CONSTANT.Home} component={HomeScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
    )
}

export default Index

