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
import { launchPicker, uploadImg } from "../utils/imagePickerUtil";
import { updateCurrentUserData } from "../store/authSlice";
import { updateUserData } from "../utils/AuthActions";

// Manages the user's profile picture
const ProfilePicture = (props) => {
  // Allows for updating state objects
  const dispatch = useDispatch();

  // Set profile picture source
  const src = props.uri ? { uri: props.uri } : defaultUserImage;

  const uid = props.uid;

  // Manage profile picture state
  const [img, setImg] = useState(src);

  // Manage loading state
  const [loading, setLoading] = useState(false);

  // Update the user's profile picture
  const updateProfilePicture = async () => {
    try {
      const localUri = await launchPicker();

      if (!localUri) {
        return;
      }

      setLoading(true);
      // Upload profile picture to server
      const firebaseUrl = await uploadImg(localUri);
      setLoading(false);

      // If upload fails, throw error
      if (!firebaseUrl) {
        throw new Error("Failed to upload image");
      }

      const updatedData = { profilePicture: firebaseUrl };

      // Update profile picture in redux store
      await updateUserData(uid, updatedData); // Auth actions
      dispatch(updateCurrentUserData({ updatedData })); // Auth slice

      setImg({ uri: firebaseUrl });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Render the profile picture component
  return (
    <TouchableOpacity onPress={updateProfilePicture}>
      {loading ? (
        <View style={styles.loadingContainer} width={props.size} height={props.size}>
          <ActivityIndicator size="small" color={colours.primary} />
        </View>
      ) : (
        <Image
          style={{
            ...styles.image,
            ...{ width: props.size, height: props.size },
          }}
          source={img}
        />
      )}
      <View style={styles.editIconContainer}>
        <FontAwesome name="pencil" size={15} color="#3b444b" />
      </View>
    </TouchableOpacity>
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
