// Library Imports
import React, { useEffect, useMemo } from "react";
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector } from "react-redux";


// Local Imports
import CustomHeaderButton from "../components/CustomHeaderButton";
import DataItem from "../components/DataItem";
import PageContainer from "../components/PageContainer";
import ScreenTitle from "../components/ScreenTitle";
import Colours from "../constants/Colours";

// Chat Contacts Screen
const ConversationsList = (props) => {
  // Get selected user from route params (if any)
  selectedUser = props.route?.params?.selectedUser;

  // Get selected user list from route params (if any)
  selectedUserList = props.route?.params?.selectedUsers;

  // Get conversation name from route params (if any)
  const conversationName = props.route?.params?.conversationName;

  // Current user data from redux store
  const userData = useSelector((state) => state.auth.userData);

  // Saved users data from redux store
  const savedUsers = useSelector((state) => state.users.savedUsers);

  // User conversations data from redux store
  const userConversations = useSelector((state) => state.conversations.conversationsData);

  // Returns a sorted, memoized array of user conversations
  const memoizedUserConversations = useMemo(() => {
    if (!userConversations) {
      return [];
    }
    return Object.values(userConversations).sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    });
  }, [userConversations]); // Depends on userConversations for memoization

  // Set custom header button options
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New Conversation"
              iconName="create-outline"
              aria-label="Start a New Conversation Button"
              onPress={() => {
                props.navigation.navigate("NewConversation");
              }}
            ></Item>
          </HeaderButtons>
        );
      },
    });
  }, []);

  // Navigate to conversation screen, adding selected users to the conversation
  useEffect(() => {
    if (!selectedUser && !selectedUserList) {
      return;
    }

    let conversationData;
    let navigationProps;

    // Check if conversation already exists
    if (selectedUser) {
      conversationData = memoizedUserConversations.find(
        cd => !cd.isGroupChat && cd.users.includes(selectedUser));
    }

    // If conversation exists, navigate to it
    if (conversationData) {
      navigationProps = { conversationId: conversationData.key }
    }
    else { // Otherwise...
      // Create new chat data with participants
      const chatUsers = selectedUserList || [selectedUser, userData.uid];
      if (!chatUsers.includes(userData.uid)) {
        chatUsers.push(userData.uid);
      }

      // Pass new chat data to conversation screen
      navigationProps = {
        newChatData: {
          users: chatUsers,
          isGroupChat: selectedUserList !== undefined,
          conversationName
        },
      };
      // If conversation name exists, add it to navigation props
      if (conversationName) {
        navigationProps.conversationName = conversationName;
      }
    }

    // Navigate to conversation screen
    props.navigation.navigate("Conversation", navigationProps);
  }, [props.route?.params]);

  // Render Conversations List Screen
  return (
    <PageContainer>
      <ScreenTitle text="Conversations"/>

      <View>
        <TouchableOpacity onPress={() => props.navigation.navigate("NewConversation", {isGroupChat: true} )}>
          <Text style={styles.newGroupText} aria-label="Create Group Chat Button">New Group</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={memoizedUserConversations}
        renderItem={(itemData) => {
          const conversationData = itemData.item;
          const conversationId = conversationData.key;

          const isGroupChat = conversationData.isGroupChat;
          let title = "";
          let image = "";

          if (isGroupChat) {
            title = conversationData.conversationName;
          }
          else {
            const otherUserId = conversationData.users.find(
              (id) => id !== userData.uid
            );
            const otherUser = savedUsers[otherUserId];
            if (!otherUser) {
              return;
            }
            title = `${otherUser.firstName} ${otherUser.lastName}`;
            image = otherUser.profilePicture;
          }

          return (
            <DataItem
              title={title}
              subtitle={conversationData.lastMessage || "New chat"}
              img={image}
              onPress={() => props.navigation.navigate("Conversation", {conversationId})}
            ></DataItem>
          );
        }}
      />
    </PageContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    color: "black",
  },
  newGroupText: {
    fontSize: 17,
    color: Colours.blue,
    marginBottom: 5
  }
});

export default ConversationsList;
