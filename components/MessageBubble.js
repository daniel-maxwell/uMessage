// Library Imports
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Local Imports
import Colours from "../constants/Colours"

// Message Bubble Component
const MessageBubble = (props) => {

  // Extract text from props
  const { type, text } = props;

  const bubbleStyles = {
    ...styles.bubbleContainer,
  }

  const messageStyles = {
    ...styles.messageText,
  }

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
      bubbleStyles.backgroundColor = Colours.primary;
      messageStyles.color = "white";
      break;

    default:
      break;
  }


  // Render Message Bubble
  return (
    <View style={styles.wrapper}>
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
    backgroundColor: Colours.offWhite,
    borderRadius: 7,
    marginBottom: 10,
    borderColor: "e2dacc",
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    color: "black",
    letterSpacing: 0.3,
  }

});


export default MessageBubble;