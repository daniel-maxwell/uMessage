// Library imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Conversation Settings Screen
const ConversationSettings = (props) => {
  return <View style={styles.container}>
    <Text>Conversation Settings Screen</Text>
  </View>
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    color: "black"
  }
});

export default ConversationSettings;
