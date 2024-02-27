import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const ConversationSettings = (props) => {
  return <View style={styles.container}>
    <Text>Conversation Settings Screen</Text>
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

export default ConversationSettings;
