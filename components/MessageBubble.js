// Library Imports
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Message Bubble Component
const MessageBubble = (props) => {

  // Extract text from props
  const { text } = props;

  // Render Message Bubble
  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.messageText}>{text}</Text>
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
  messageText: {
    fontSize: 16,
    color: "black",
    letterSpacing: 0.3,
  }
});


export default MessageBubble;