import React, {} from 'react'
import { StatusBar, Text, View } from 'react-native'

import Navigation from './src/navigation/index'

import { useFonts } from '@use-expo/font';

import {AuthProvider} from 'context/auth'
import {DataProvider} from 'context/data'
import Loading from './src/screen/Loading';


const App = () => {
  
  let [fontsLoaded] = useFonts({
      'Montserrat': require('./assets/fonts/Montserrat-ExtraLight.ttf'),
      'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
      'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
  });

  if(!fontsLoaded){
    return <View/>
  }
  return (
    <>
      <StatusBar translucent={true} backgroundColor={'transparent'}/>
      <AuthProvider>
      <DataProvider>
          <Navigation/>
      </DataProvider>
      </AuthProvider>
    </>
  )
}

export default App
