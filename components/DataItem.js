// Library Imports
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { Ionicons } from '@expo/vector-icons';

// Local Imports
import ProfilePicture from "./ProfilePicture";
import Colours from "../constants/Colours";

// UserItem Component
const DataItem = (props) => {
  const { title, subtitle, img, type, isChecked } = props;

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.container}>

        <ProfilePicture
          uri={img}
          size={40}
          aria-label={`Profile Picture of User`}
        />

        <View style={styles.textContainer} aria-label="User's Name">
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        {
          type === "checkbox" && (
            <View style={{...styles.checkboxContainer, ...isChecked && styles.checkedStyle}}>
              <Ionicons name="checkmark" size={18} color="white" />
            </View>
          )
        }
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
    flex: 1,
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
  checkboxContainer: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: Colours.lighterGrey,
    backgroundColor: "white"
  },
  checkedStyle: {
    backgroundColor: Colours.primary,
    borderColor: "transparent"
  }
});

export default DataItem;
