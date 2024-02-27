import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const Settings = (props) => {
  return <View style={styles.container}>
    <Text>Main Setting Screen</Text>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    color: "black"
  }
});

export default Settings;
