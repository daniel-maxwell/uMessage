// Library Imports
import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

// Local Imports
import defaultUserImage from "../assets/images/defaultUserImg.jpeg";
import colours from "../constants/Colours";
import { launchPicker, uploadImg } from "../utils/ImagePickerUtil";
import { updateCurrentUserData } from "../store/authSlice";
import { updateUserData } from "../utils/AuthActions";

// Manages the user's profile picture
const ProfilePicture = (props) => {
  const dispatch = useDispatch(); // Allows for updating state objects
  const src = props.uri ? { uri: props.uri } : defaultUserImage; // Set profile picture source
  const uid = props.uid; // User ID
  const [img, setImg] = useState(src); // Manage profile picture state
  const [loading, setLoading] = useState(false); // Manage loading state
  const showEditIcon = props.showEditIcon && props.showEditIcon === true; // Show / Hide edit icon

  // Update the user's profile picture
  const updateProfilePicture = async () => {
    try {
      // Launch Image Picker and get local URI of image
      const localUri = await launchPicker();

      // If no image was selected, return
      if (!localUri) {
        return;
      }

      setLoading(true); // Enable loading state

      // Upload profile picture to server
      const firebaseUrl = await uploadImg(localUri);
      setLoading(false);

      // If upload fails, throw error
      if (!firebaseUrl) {
        throw new Error("Failed to upload image");
      }

      // Update user data object with new profile picture URL
      const updatedData = { profilePicture: firebaseUrl };

      // Update profile picture in redux store
      await updateUserData(uid, updatedData); // Auth actions
      dispatch(updateCurrentUserData({ updatedData })); // Auth slice

      // Set profile picture state to new image stored in the database
      setImg({ uri: firebaseUrl });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Determines if the profile picture is clickable
  const Container = showEditIcon ? TouchableOpacity : View;

  // Render the profile picture component
  return (
    <Container onPress={updateProfilePicture}>
      {loading ? (
        <View style={styles.loadingContainer} width={props.size} height={props.size}>
          <ActivityIndicator size="small" color={colours.primary} aria-label="Loading indicator"/>
        </View>
      ) : (
        <Image
          style={{
            ...styles.image,
            ...{ width: props.size, height: props.size },
          }}
          source={img}
          aria-label="Profile Picture"
        />
      )}
      {
        // Render edit icon if showEditIcon is true
        showEditIcon && !loading && (
          <View style={styles.editIconContainer} aria-label="Profile Picture Edit Button">
            <FontAwesome name="pencil" size={15} color="#3b444b" />
          </View>
        )
      }

    </Container>
  );
};

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
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
