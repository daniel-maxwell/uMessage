// Library Imports
import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ImageBackground,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";

// Local Imports
import backgroundImage from "../assets/images/Conversation_Background_Image.png";
import colours from "../constants/Colours";
import PageContainer from "../components/PageContainer";
import MessageBubble from "../components/MessageBubble";
import { createNewConversation, sendMessageTextOnly } from "../utils/MessagingActions";

// Chat Contacts Screen
const Conversation = (props) => {

  // Participants state
  const [participants, setParticipants] = useState([]);

  // Message contents state
  const [messageText, setMessageText] = useState("");

  // Conversation ID state
  const [conversationId, setConversationId] = useState(
    props.route?.params?.conversationId
  );

  // Error text state
  const [errorText, setErrorText] = useState("");

  // User data from redux store
  const userData = useSelector((state) => state.auth.userData);

  // Saved users from redux store
  const savedUsers = useSelector((state) => state.users.savedUsers);

  // Saved conversations from redux store
  const savedConversations = useSelector(
    (state) => state.conversations.conversationsData
  );


  const messageStateData = useSelector((state) => state.messages.messagesData);

  const savedMessages = useMemo(() => {
    if (!conversationId) return [];

    const conversationMsgData = messageStateData[conversationId];
    if (!conversationMsgData) return [];

    const messages = [];
    for (const key in conversationMsgData) {
      const message = conversationMsgData[key];
      messages.push({
        key,
        ...message,
      });
    }
    return messages;
  }, [conversationId, messageStateData]);

  /*
  // Saved messages from redux store
  const savedMessages = useSelector((state) => {
    if (!conversationId) return [];

    // Get conversation messages data
    const conversationMsgData = state.messages.messagesData[conversationId];

    if (!conversationMsgData) return [];

    const messages = [];
    // Loop through saved messages and push to array
    for (const key in conversationMsgData) {
      const message = conversationMsgData[key];
      messages.push({
        key,
        ...message,
      });
    }
    return messages;
  });
  */



  // If there is a conversation ID, get conversation data
  // Otherwise, get new chat data from route params
  const conversationData =
    (conversationId && savedConversations[conversationId]) ||
    props.route?.params?.newChatData;

  // Get title for conversation screen
  const getTitle = () => {
    const otherUser = participants.find((user) => user !== userData.uid);
    const otherUserData = savedUsers[otherUser];
    return otherUserData
      ? `${otherUserData.firstName} ${otherUserData.lastName}`
      : "Conversation";
  };

  // Sets page title
  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: getTitle(),
    });
    setParticipants(conversationData.users);
  }, [participants]);

  // Send message callback function
  const sendMessage = useCallback(async () => {
    try {
      let id = conversationId;
      if (!id) {
        // Create new conversation
        id = await createNewConversation(
          userData.uid,
          props.route.params.newChatData
        );
        setConversationId(id);
        setMessageText("");
      }

      // Send message
      await sendMessageTextOnly(id, userData.uid, messageText);
    } catch (error) {
      console.log("Error sending message:", error);
      setErrorText("You have been signed out for security reasons. Please sign in again.");
      setTimeout(() => {
        setErrorText("");
      }, 6000);
    }


  }, [conversationId, messageText]);


  // Render Conversation Screen
  return (
    <SafeAreaView edges={["right", "left", "bottom"]} style={styles.container}>
      <KeyboardAvoidingView /* Ensure keyboard does not cover input */
        style={styles.typingScreen}
        behavior={Platform.OS === "ios" ? "padding" : undefined} // No padding necessary for Android
        keyboardVerticalOffset={100}
      >
        <ImageBackground /* Conversation Background Image */
          source={backgroundImage}
          style={styles.backgroundImage}
        >
          <PageContainer style={styles.messagePageContainer}>
            {!conversationId && (
              <MessageBubble
                type="sys"
                text="Here's your new conversation. Say hi!"
              />
            )}

            {errorText !== "" && (
              <MessageBubble type="error" text={errorText} />
            )}

            { // Render messages if conversation ID exists
              conversationId && (
                <FlatList inverted /* Invert for list to emerge from the bottom */
                  style={styles.messageList}
                  data={savedMessages.reverse()} /* Reverse for newest messages at the bottom */
                  renderItem={(itemData) => {
                    const messageData = itemData.item;
                    return (
                      <MessageBubble
                        type={messageData.sender === userData.uid ? "user" : "other"}
                        text={messageData.text}
                      />
                    );
                  }}
                />
              )
            }
          </PageContainer>
        </ImageBackground>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => console.log("Pressed add!")}
          >
            <Feather name="plus" size={26} color={colours.blue} />
          </TouchableOpacity>

          <TextInput
            style={styles.textbox}
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            onSubmitEditing={sendMessage}
          />

          {messageText === "" /* Show camera button if empty message */ && (
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={() => console.log("Pressed Camera!")}
            >
              <Feather name="camera" size={26} color={colours.blue} />
            </TouchableOpacity>
          )}
          {messageText !==
            "" /* Show send button if message has contents */ && (
            <TouchableOpacity
              style={{ ...styles.mediaButton, ...styles.sendButton }}
              onPress={sendMessage}
            >
              <Feather name="send" size={20} color={"white"} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  typingScreen: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  textbox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colours.lightGrey,
    marginHorizontal: 15,
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  mediaButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 35,
  },
  sendButton: {
    backgroundColor: colours.blue,
    borderRadius: 50,
    padding: 8,
    width: 35,
  },
  messagePageContainer: {
    backgroundColor: "transparent",
  },
  messageList: {

  },
});

export default Conversation;
