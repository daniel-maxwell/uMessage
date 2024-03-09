// Library Imports
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Local Imports
import defaultUserImage from "../assets/images/defaultUserImg.jpeg";
import colours from "../constants/Colours";
import { launchPicker } from "../utils/imagePickerUtil";

// Manages the user's profile picture
const ProfilePicture = (props) => {

  // Set profile picture source
  const src = props.uri ? { uri: props.uri } : defaultUserImage;

  // Manage profile picture state
  const [img, setImg] = useState(src);

  // Update the user's profile picture
  const updateProfilePicture = async () => {

    try {
      const localUri = await launchPicker();

      if (!localUri) {
        return;
      }

      // Upload profile picture to server

      // Update profile picture in redux store

      setImg({ uri: localUri });

    }
    catch (error) {
      console.log(error);
    }

  }

  return (
    <TouchableOpacity onPress={updateProfilePicture}>
      <Image
        style={{
          ...styles.image,
          ...{ width: props.size, height: props.size },
        }}
        source={img}
      />
      <View style={styles.editIconContainer}>
        <FontAwesome name="pencil" size={15} color="#3b444b" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 100,
    borderColor: colours.grey,
    borderWidth: 1,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 5,
    paddingHorizontal: 6,
    backgroundColor: colours.offWhite,
    borderColor: colours.lightGrey,
    borderWidth: 0.8,
    borderRadius: 200,
  },
});

export default ProfilePicture;
