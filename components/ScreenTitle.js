// Library Imports
import React from "react";
import { Text, View, StyleSheet } from "react-native";

// Local Imports
import colours from "../constants/Colours";

// Screen Title Component
export default ScreenTitle = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{props.children}</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    fontSize: colours.textColour,
    fontFamily: "bold",
    letterSpacing: 0.3,
  },
  titleText: {
    fontFamily: "bold",
    fontSize: 24,
    color: colours.textColour,
  },
});