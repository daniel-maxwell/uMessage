// Library Imports
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import AwesomeAlert from "react-native-awesome-alerts";

// Local Imports
import backgroundImage from "../assets/images/Conversation_Background_Image.png";
import Colours from "../constants/Colours";
import PageContainer from "../components/PageContainer";
import MessageBubble from "../components/MessageBubble";
import {
  createNewConversation,
  sendMessageTextOnly,
  sendMessageWithImage,
} from "../utils/MessagingActions";
import {
  launchCamera,
  launchPicker,
  uploadImg,
} from "../utils/ImagePickerUtil";
import ReplyTo from "../components/ReplyTo";

// Chat Contacts Screen
const Conversation = (props) => {
  const [loading, setLoading] = useState(false); // Loading state
  const [participants, setParticipants] = useState([]); // Participants state
  const [messageText, setMessageText] = useState(""); // Message contents state
  const [conversationId, setConversationId] = useState(
    // Conversation ID state
    props.route?.params?.conversationId
  );
  const [errorText, setErrorText] = useState(""); // Error text state
  const [localImgUri, setLocalImgUri] = useState(""); // Local image URI state
  const [replyingTo, setReplyingTo] = useState(); // Reply to message state
  const flatList = useRef(); // Flatlist reference
  const userData = useSelector((state) => state.auth.userData); // User data from redux store
  const savedUsers = useSelector((state) => state.users.savedUsers); // Saved users from redux store
  const savedConversations = useSelector(
    // Saved conversations from redux store
    (state) => state.conversations.conversationsData
  );
  const messageStateData = useSelector((state) => state.messages.messagesData); // Saved messages from redux store

  const savedMessages = useMemo(() => {
    // Returns memoized saved messages
    if (!conversationId) return [];

    // Get current conversation message data
    const conversationMsgData = messageStateData[conversationId];
    if (!conversationMsgData) return [];

    // Loop through saved messages and push to array
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
        setReplyingTo(null);
      }

      // Send message
      await sendMessageTextOnly(
        id,
        userData.uid,
        messageText,
        replyingTo && replyingTo.key
      );
      setMessageText("");
      setReplyingTo(null);
    } catch (error) {
      setErrorText(
        "You have been signed out for security reasons. Please sign in again."
      );
      setMessageText("");
      setTimeout(() => {
        setErrorText("");
      }, 6000);
    }
  }, [conversationId, messageText]);

  // Handles opening the user's camera and taking a photo to send
  const openCamera = useCallback(async () => {
    try {
      const localUri = await launchCamera();
      if (!localUri) return;
      setLocalImgUri(localUri);
      setMessageText("");
    } catch (error) {
      alert("Error opening camera:", error);
    }
  }, [localImgUri]);

  // Handles selecting an image to send from the user's camera roll
  const selectImg = useCallback(async () => {
    try {
      const localUri = await launchPicker();
      if (!localUri) return;
      setLocalImgUri(localUri);
      setMessageText("");
    } catch (error) {
      alert("Error selecting image:", error);
    }
  }, [localImgUri]);

  // Handles uploading the selected image to Firebase
  const uploadImgToFirebase = useCallback(async () => {
    setLoading(true);

    let id = conversationId;
    if (!id) {
      // Create new conversation
      id = await createNewConversation(
        userData.uid,
        props.route.params.newChatData
      );
    }

    try {
      // Get remote URI
      const remoteUri = await uploadImg(localImgUri, true);
      setLoading(false);

      await sendMessageWithImage(id, userData.uid, remoteUri);

      setTimeout(() => setLocalImgUri(""), 500);
    } catch (error) {
      setLoading(false);
    }
  }, [localImgUri, conversationId, loading]);

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
                aria-label="System message"
              />
            )}

            {errorText !== "" && (
              <MessageBubble
                type="error"
                text={errorText}
                aria-label="error message"
              />
            )}

            {
              // Render messages if conversation ID exists
              conversationId && (
                <FlatList /* Invert for list to emerge from the bottom */
                  style={styles.messageList}
                  data={
                    savedMessages
                  } /* Reverse for newest messages at the bottom */ // needs work to ensure always reversed on load
                  ref={(ref) => (flatList.current = ref)}
                  onContentSizeChange={() =>
                    flatList.current.scrollToEnd({ animated: true })
                  }
                  onLayout={() =>
                    flatList.current.scrollToEnd({ animated: true })
                  }
                  renderItem={(itemData) => {
                    const messageData = itemData.item;
                    return (
                      <MessageBubble
                        type={
                          messageData.sender === userData.uid ? "user" : "other"
                        }
                        text={messageData.text}
                        time={messageData.sentAt}
                        messageId={messageData.key}
                        userId={userData.uid}
                        conversationId={conversationId}
                        imageUrl={messageData.imgUrl}
                        aria-label="message bubble"
                        setReply={() => setReplyingTo(messageData)}
                        replyingTo={
                          messageData.replyTo &&
                          savedMessages.find(i => i.key === messageData.replyTo)
                        }
                      />
                    );
                  }}
                />
              )
            }
          </PageContainer>
          {replyingTo && (
            <ReplyTo
              text={replyingTo.text}
              user={savedUsers[replyingTo.sender]}
              onCancel={() => setReplyingTo(null)}
            />
          )}
        </ImageBackground>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={selectImg}
            aria-label="add media button"
          >
            <Feather name="plus" size={26} color={Colours.blue} />
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
              onPress={openCamera}
              aria-label="open camera button"
            >
              <Feather name="camera" size={26} color={Colours.blue} />
            </TouchableOpacity>
          )}
          {messageText !==
            "" /* Show send button if message has contents */ && (
            <TouchableOpacity
              style={{ ...styles.mediaButton, ...styles.sendButton }}
              onPress={sendMessage}
              aria-label="send message button"
            >
              <Feather name="send" size={20} color={"white"} />
            </TouchableOpacity>
          )}

          <AwesomeAlert
            title="Send Image?"
            titleStyle={styles.awesomeAlertTitle}
            show={localImgUri !== ""}
            showConfirmButton={true}
            confirmButtonColor={Colours.primary}
            confirmText="Send"
            onConfirmPressed={() => uploadImgToFirebase()}
            showCancelButton={true}
            cancelText="Cancel"
            cancelButtonColor={Colours.red}
            onCancelPressed={() => setLocalImgUri("")}
            onDismiss={() => setLocalImgUri("")}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            aria-label="send image confirm window"
            customView={
              <View>
                {loading && (
                  <ActivityIndicator
                    size="large"
                    color={Colours.primary}
                    style={{ marginBottom: 10 }}
                  />
                )}
                {localImgUri !== "" && !loading && (
                  <Image
                    source={{ uri: localImgUri }}
                    style={styles.alertImgStyle}
                  ></Image>
                )}
              </View>
            }
          />
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
    borderColor: Colours.lightGrey,
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
    backgroundColor: Colours.blue,
    borderRadius: 50,
    padding: 8,
    width: 35,
  },
  messagePageContainer: {
    backgroundColor: "transparent",
  },
  awesomeAlertTitle: {
    color: Colours.textColour,
    fontFamily: "medium",
    letterSpacing: 0.3,
  },
  alertImgStyle: {
    width: 225,
    height: 225,
    borderRadius: 7,
    marginTop: 12,
  },
});

export default Conversation;
