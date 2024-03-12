// Library Imports
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Local Imports
import Colours from "../constants/Colours"

// Message Bubble Component
const MessageBubble = (props) => {

  // Extract text from props
  const { type, text } = props;
  const bubbleStyles = { ...styles.bubbleContainer }
  const messageStyles = { ...styles.messageText }
  const wrapperStyles = { ...styles.wrapper }

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
        <Text style={messageStyles}>{text}</Text>
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
  }

});


export default MessageBubble;