// Library Imports
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Local Imports
import CustomHeaderButton from '../components/CustomHeaderButton';

// Chat Contacts Screen
const ConversationsList = (props) => {

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="New Conversation"
            iconName="create-outline"
            onPress={() => {props.navigation.navigate('NewConversation')}}
          ></Item>
        </HeaderButtons>
      },
    });
  }, []);

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
