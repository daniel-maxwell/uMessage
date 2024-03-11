// Library Imports
import React, { useState, useCallback, useEffect } from "react";
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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";

// Local Imports
import backgroundImage from "../assets/images/Conversation_Background_Image.png";
import colours from "../constants/Colours";
import PageContainer from "../components/PageContainer";
import MessageBubble from "../components/MessageBubble";
import { createNewConversation } from "../utils/MessagingActions";

// Chat Contacts Screen
const Conversation = props => {

  // User data from redux store
  const userData = useSelector((state) => state.auth.userData);

  // Participants state
  const [participants, setParticipants] = useState([]);

  // Saved users from redux store
  const savedUsers = useSelector((state) => state.users.savedUsers);

  // Message contents state
  const [messageText, setMessageText] = useState("");

  // Conversation data from route params
  const conversationData = props.route?.params?.newChatData;

  // Conversation ID state
  const [conversationId, setConversationId] = useState(props.route?.params?.conversationId);

  // Get title for conversation screen
  const getTitle = () => {
    const otherUser = participants.find((user) => user !== userData.uid);
    const otherUserData = savedUsers[otherUser];
    return otherUserData ? `${otherUserData.firstName} ${otherUserData.lastName}` : "Conversation";
  }

  // Sets page title
  useEffect (() => {
    props.navigation.setOptions({
      headerTitle: getTitle(),
    });
    setParticipants(conversationData.users);
  }, [participants]);

  // Send message callback function
  const sendMessage = useCallback( async () => {

    try {
      let id = conversationId;
      if (!id) { // Create new conversation
        id = await createNewConversation(userData.uid, props.route.params.newChatData);
        setConversationId(id);
      }
    }
    catch (error) {
      console.log("Error sending message:", error);
    }


    setMessageText("");
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
            {
              !conversationId && <MessageBubble type="sys" text="Here's your new conversation. Say hi!"/>
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

          {messageText === "" && ( /* Show camera button if empty message */
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={() => console.log("Pressed Camera!")}
            >
              <Feather name="camera" size={26} color={colours.blue} />
            </TouchableOpacity>
          )}
          {messageText !== "" && ( /* Show send button if message has contents */
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
  messagePageContainer:{
    backgroundColor: "transparent",
  }
});

export default Conversation;
