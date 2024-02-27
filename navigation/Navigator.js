import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import HomeNavigator from './HomeNavigator';








const Navigator = (props) => {

  return (
    <NavigationContainer>
      <HomeNavigator />

    </NavigationContainer>
  );
}


export default Navigator;