// Library Imports
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

// Local Imports
import ProfilePicture from "./ProfilePicture";
import Colours from "../constants/Colours";

// UserItem Component
const DataItem = (props) => {


  const { title, subtitle, img } = props;



  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>

        <ProfilePicture
          uri={img}
          size={40}
        />



        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomColor: Colours.lighterGrey,
    borderBottomWidth: 1,
    minHeight: 50,

  },
  textContainer: {
    marginLeft: 14,
  },
  title: {
    fontWeight: "black",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontWeight: "medium",
    letterSpacing: 0.3,
    color: Colours.grey,
  },
});

export default DataItem;
