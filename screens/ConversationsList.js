// Library Imports
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector } from 'react-redux';

// Local Imports
import CustomHeaderButton from '../components/CustomHeaderButton';

// Chat Contacts Screen
const ConversationsList = (props) => {

  // Get selected user from route params (if any)
  selectedUser = props.route?.params?.selectedUser;

  // User data from redux store
  const userData = useSelector((state) => state.auth.userData);

  // Set custom header button options
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

  // Navigate to conversation screen, adding selected users to the conversation
  useEffect(() => {
    if(!selectedUser){
      console.log('No selected user');
      return;
    }

    // Create new chat data with participants
    const chatUsers = [selectedUser, userData.uid];

    // Pass new chat data to conversation screen
    const navigationProps = {
      newChatData: { users: chatUsers }
    }

    // Navigate to conversation screen
    props.navigation.navigate('Conversation', navigationProps);

  }, [props.route?.params]);

  // Render Conversations List Screen
  return <View style={styles.container}>
    <Text>Conversations List Screen</Text>
    <Button title="Go to conversation" onPress={() => props.navigation.navigate('Conversation')} />
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

export default ConversationsList;
