// Library Imports
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

// Local Imports
import Colours from "../constants/Colours"

// 👇🏼 Not my code! - Source: https://stackoverflow.com/questions/25275696/javascript-format-date-time
function formatTime(dateStr) {
  var date = new Date(dateStr);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  return strTime = hours + ':' + minutes + ' ' + ampm;
}

// Message Bubble Component
const MessageBubble = (props) => {

  // Extract text from props
  const { type, text, imageUrl, time } = props;
  const bubbleStyles = { ...styles.bubbleContainer }
  const messageStyles = { ...styles.messageText }
  const wrapperStyles = { ...styles.wrapper }
  const timeStr = formatTime(time);

  // Set styles based on message type (system, user, other user, error)
  switch ( type ) {
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
      bubbleStyles.backgroundColor = "#e7fed6"
      bubbleStyles.maxWidth = "86%";
      break;

    case "other":
      wrapperStyles.justifyContent = "flex-start";
      bubbleStyles.maxWidth = "86%";

      break;

    case "error":
      bubbleStyles.backgroundColor = Colours.red;
      messageStyles.color = "white";
      bubbleStyles.marginTop = 10;
      break;

    default:
      break;
  }

  // Render Message Bubble
  return (
    <View style={wrapperStyles}>
      <View style={bubbleStyles}>
        { !imageUrl && (
          <Text style={messageStyles}>{text}</Text>
        )}
        {
          imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.messageImage} />
          )
        }
        {
           timeStr && (
            <View style={styles.timeContainer}>
              <Text style={styles.messageTime}>{timeStr}</Text>
            </View>
           )
        }
      </View>
    </View>
  )
}

// Styles
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bubbleContainer: {
    padding: 5,
    paddingHorizontal: 9,
    backgroundColor: Colours.offWhite,
    borderRadius: 9,
    marginBottom: 10,
    borderColor: "e2dacc",
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
  }
});

export default MessageBubble;