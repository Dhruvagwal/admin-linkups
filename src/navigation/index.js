import React, {useEffect, useState} from 'react'
import {NavigationContainer, DefaultTheme} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import CONSTANT from './navigationConstant.json'
import HomeScreen from 'screen/main'
import LoadingScreen from 'screen/Loading'
import LanguageScreen from 'screen/setting/language'
import AddOrderScreen from 'screen/order/AddOrder'
import OrderDescriptionScreen from 'screen/order/OrderDescription'

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
                >
                <Stack.Navigator headerMode={false} screenOptions={{ animationEnabled: false }} >
                    {Loading && <Stack.Screen name={CONSTANT.Loading} component={LoadingScreen}/>}
                    <Stack.Screen name={CONSTANT.Home} component={HomeScreen}/>
                    <Stack.Screen name={CONSTANT.Language} component={LanguageScreen}/>
                    <Stack.Screen name={CONSTANT.OrderDescription} component={OrderDescriptionScreen}/>
                    <Stack.Screen name={CONSTANT.AddOrder} component={AddOrderScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
    )
}

export default Index

