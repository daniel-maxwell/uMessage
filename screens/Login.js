// Library Imports
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Local Imports
import PageContainer from '../components/PageContainer';
import Input from '../components/input';


const Login = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageContainer>
        <Input
          label="First Name"
          icon="person-outline"
          iconPack={Ionicons}
          iconSize={20}
        />
      </PageContainer>
    </SafeAreaView>
  )
};



const styles = StyleSheet.create({
});

export default Login;
