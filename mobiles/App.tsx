import React from 'react';
import {Text, View, StatusBar } from 'react-native';
import Routes from './src/routes'
import {AppLoading} from 'expo'

import {Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto'
import {Ubuntu_700Bold, useFonts} from '@expo-google-fonts/ubuntu'

export default function App() {
  const [fontsLoaded] = useFonts({
      Roboto_400Regular,
      Roboto_500Medium,
      Ubuntu_700Bold
  })

  if (!fontsLoaded){
    return <AppLoading></AppLoading>
    
  }


  return (
    // <> é uma tag do react native para indicar uma "div" que não irá gerar impacto de renderização,
    // serve pois em react native não se pode renderizar mais de um componente se eles não estiverem enclausurados num outro componente
    <> 
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent></StatusBar>
      <Routes></Routes>
    </>
  );
}
