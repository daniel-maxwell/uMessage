// Library Imports
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Local Imports
import PageContainer from '../components/PageContainer';
import Input from '../components/input';
import colours from '../constants/colours';
import SubmitFormButton from '../components/SubmitFormButton';

// Login / Authentication Screen
const Login = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageContainer>
        <Input /* First Name field */
          label="First Name"
          icon="person-outline"
          iconPack={Ionicons}
          iconSize={20}
          iconColor={colours.blue}
        />
        <Input /* Last Name field */
          label="Last Name"
          icon="person-outline"
          iconPack={Ionicons}
          iconSize={20}
          iconColor={colours.blue}
        />
        <Input /* E-mail field */
          label="E-mail"
          icon="mail-outline"
          iconPack={Ionicons}
          iconSize={20}
          iconColor={colours.blue}
        />
        <Input /* Password field */
          label="Password"
          icon="lock-closed-outline"
          iconPack={Ionicons}
          iconSize={20}
          iconColor={colours.blue}
        />
        <SubmitFormButton /* Submit */
          title="Sign Up"
          onPress={() => console.log("Sign Up")}
          disabled={false}
        />
      </PageContainer>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
});

export default Login;
