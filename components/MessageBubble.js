// Library Imports
import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";
import uuid from "react-native-uuid";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

// Local Imports
import Colours from "../constants/Colours";
import { likeMessage } from "../utils/MessagingActions";

// 👇🏼 Not my code! - Source: https://stackoverflow.com/questions/25275696/javascript-format-date-time
function formatTime(dateStr) {
  var date = new Date(dateStr);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return (strTime = hours + ":" + minutes + " " + ampm);
}

const MenuItem = (props) => {
  const Icon = props.iconPack ?? Ionicons;
  return (
    <MenuOption onSelect={props.onSelect}>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuText}>{props.text}</Text>
        <Icon name={props.icon} size={props.iconSize} color={props.iconColor} />
      </View>
    </MenuOption>
  );
};

// Message Bubble Component
const MessageBubble = (props) => {
  // Extract type, text, imageUrl, time from props
  const {
    type,
    text,
    imageUrl,
    time,
    messageId,
    conversationId,
    userId,
    setReply,
    replyingTo,
    name
  } = props;

  const likedMessages = useSelector(
    (state) => state.messages.likedMessages[conversationId] ?? {}
  );
  const savedUsers = useSelector(state => state.users.savedUsers);

  const bubbleStyles = { ...styles.bubbleContainer };
  const messageStyles = { ...styles.messageText };
  const wrapperStyles = { ...styles.wrapper };
  const timeStr = formatTime(time);

  const menuRef = useRef(null);
  const menuId = useRef(uuid.v4());

  let Container = View;
  let isUserMesage = false;

  // Set styles based on message type (system, user, other user, error)
  switch (type) {
    case "sys":
      bubbleStyles.paddingHorizontal = 10;
      bubbleStyles.marginTop = 10;
      bubbleStyles.alignItems = "center";
      bubbleStyles.backgroundColor = Colours.nude;
      messageStyles.color = Colours.systemMsgText;
      bubbleStyles.borderColor = Colours.grey;
      break;

    case "user":
      wrapperStyles.justifyContent = "flex-end";
      bubbleStyles.backgroundColor = "#e7fed6";
      bubbleStyles.maxWidth = "86%";
      Container = TouchableWithoutFeedback;
      isUserMesage = true;
      break;

    case "other":
      wrapperStyles.justifyContent = "flex-start";
      bubbleStyles.maxWidth = "86%";
      Container = TouchableWithoutFeedback;
      isUserMesage = true;
      break;

    case "reply":
      bubbleStyles.backgroundColor = '#F2F2F2';
      break;

    case "error":
      bubbleStyles.backgroundColor = Colours.red;
      messageStyles.color = "white";
      bubbleStyles.marginTop = 10;
      break;

    default:
      break;
  }

  // Copy message to clipboard
  const copyToClipboard = async (text) => await Clipboard.setStringAsync(text);

  // Check if message is liked
  const isLiked = isUserMesage && likedMessages[messageId] !== undefined;

  // Check if message is replying to another message
  const replyingToUser = replyingTo && savedUsers[replyingTo.sender];

  // Render Message Bubble
  return (
    <View style={wrapperStyles}>
      <Container
        onLongPress={() =>
          menuRef.current.props.ctx.menuActions.openMenu(menuId.current)
        }
        style={{ width: "100%" }}
      >
        <View style={bubbleStyles}>
          {
            name &&
            <Text style={styles.name}>{name}</Text>
          }
          {
            replyingToUser && (
              <MessageBubble
                type='reply'
                text={replyingTo.text}
                name={`${replyingToUser.firstName} ${replyingToUser.lastName}`}
              />
            )
          }

          {!imageUrl && <Text style={messageStyles}>{text}</Text>}
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.messageImage} />
          )}

          {timeStr && (
            <View style={styles.timeContainer}>
              <Text style={styles.messageTime}>{timeStr}</Text>
              {isLiked && (
                <Ionicons
                  name="heart"
                  size={16}
                  color="red"
                  style={{ marginLeft: 5 }}
                />
              )}
            </View>
          )}
          <Menu name={menuId.current} ref={menuRef}>
            <MenuTrigger />
            <MenuOptions
              optionsContainerStyle={{
                width: 110,
                borderRadius: 5,
                backgroundColor: Colours.offWhite,
              }}
            >
              <MenuItem
                text="Copy"
                icon={"copy-outline"}
                iconColor={Colours.textColour}
                iconSize={18}
                onSelect={() => copyToClipboard(text)}
              />
              <MenuItem
                text={`${isLiked ? "Unlike" : "Like"}`}
                icon={`${isLiked ? "heart" : "heart-outline"}`}
                iconColor={isLiked ? "red" : Colours.textColour}
                iconSize={20}
                onSelect={() => likeMessage(messageId, conversationId, userId)}
              />
              <MenuItem
                text={"Reply"}
                icon={"arrow-undo-outline"}
                iconColor={Colours.textColour}
                iconSize={20}
                onSelect={setReply}
              />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 10,
  },
  bubbleContainer: {
    padding: 5,
    paddingHorizontal: 9,
    backgroundColor: Colours.offWhite,
    borderRadius: 9,
    marginBottom: 10,
    borderColor: "#9c9c9c",
    borderWidth: 0.75,
  },
  messageText: {
    fontSize: 16,
    color: "black",
    letterSpacing: 0.3,
  },
  timeContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  messageTime: {
    fontSize: 12,
    color: Colours.grey,
    letterSpacing: 0.3,
  },
  messageImage: {
    width: 300,
    height: 300,
    borderRadius: 9,
    marginVertical: 5,
  },
  menuItemContainer: {
    flexDirection: "row",
    padding: 5,
  },
  menuText: {
    flex: 1,
    fontFamily: "medium",
    letterSpacing: 0.3,
    fontSize: 16,
  },
});

export default MessageBubble;
