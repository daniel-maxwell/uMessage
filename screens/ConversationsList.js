import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

// Chat Contacts Screen
const ConversationsList = (props) => {

  return <View style={styles.container}>

    <Text>Contacts Screen</Text>
    <Button title="Conversation Settings" onPress={() => props.navigation.navigate('ConversationSettings')} />
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

export default ConversationsList;
