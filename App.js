import React, {} from 'react'
import { StatusBar, Text, View } from 'react-native'

import Navigation from './src/navigation/index'

import { useFonts } from '@use-expo/font';


const App = () => {
  
  let [fontsLoaded] = useFonts({
      'Montserrat': require('./assets/fonts/Montserrat-ExtraLight.ttf'),
      'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
      'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
  });

  if(!fontsLoaded){
    return <View>
      <Text>Loading..</Text>
    </View>
  }
  return (
    <>
      <StatusBar translucent={true} backgroundColor={'transparent'}/>
      {/* <AuthProvider> */}
      {/* <DataProvider> */}
          <Navigation/>
      {/* </DataProvider> */}
      {/* </AuthProvider> */}
    </>
  )
}

export default App
