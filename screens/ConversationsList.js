// Library Imports
import React, { useEffect, useMemo } from "react";
import { StyleSheet, FlatList } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector } from "react-redux";

// Local Imports
import CustomHeaderButton from "../components/CustomHeaderButton";
import DataItem from "../components/DataItem";
import PageContainer from "../components/PageContainer";
import ScreenTitle from "../components/ScreenTitle";

// Chat Contacts Screen
const ConversationsList = (props) => {
  // Get selected user from route params (if any)
  selectedUser = props.route?.params?.selectedUser;

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
    if (!selectedUser) {
      return;
    }

    // Create new chat data with participants
    const chatUsers = [selectedUser, userData.uid];

    // Pass new chat data to conversation screen
    const navigationProps = {
      newChatData: { users: chatUsers },
    };

    // Navigate to conversation screen
    props.navigation.navigate("Conversation", navigationProps);
  }, [props.route?.params]);

  // Render Conversations List Screen
  return (
    <PageContainer>
      <ScreenTitle text="Conversations"/>
      <FlatList
        data={memoizedUserConversations}
        renderItem={(itemData) => {
          const conversationData = itemData.item;
          const conversationId = conversationData.key;
          const otherUserId = conversationData.users.find(
            (id) => id !== userData.uid
          );
          const otherUser = savedUsers[otherUserId];
          if (!otherUser) {
            return;
          }
          const profilePic = otherUser.profilePicture;
          return (
            <DataItem
              title={`${otherUser.firstName} ${otherUser.lastName}`}
              subtitle={conversationData.lastMessage || "New chat"}
              img={profilePic}
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
});

export default ConversationsList;
