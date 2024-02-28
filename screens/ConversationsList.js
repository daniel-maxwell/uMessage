import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

// Chat Contacts Screen
const ConversationsList = (props) => {

  return <View style={styles.container}>

    <Text>Conversations List Screen</Text>
    <Button title="Go to conversation" onPress={() => props.navigation.navigate('Conversation')} />
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
