// Library imports
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

// Local imports
import HomeNavigator from './HomeNavigator';
import SignUp from '../screens/Auth';

const Navigator = (props) => {

  const isLoggedIn = false;

  return (
    <NavigationContainer>
      { isLoggedIn && <HomeNavigator /> }
      { !isLoggedIn && <SignUp /> }
    </NavigationContainer>
  );
}


export default Navigator;