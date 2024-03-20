// Library imports
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Local imports
import colours from "../constants/Colours";
import Styles from "../constants/Styles";
import { login, setAutoLoginAttempted } from "../store/authSlice";
import { fetchUserData } from "../utils/UserActions";

// StartUp screen component
const StartUp = () => {
  // Redux dispatch
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is authenticated
    const attemptAuth = async () => {
      // Get stored user data if it exists
      const storedUserData = await AsyncStorage.getItem("userData");

      if (!storedUserData) {
        dispatch(setAutoLoginAttempted());
        return;
      }

      // Check if authentication token has expired
      const { token, uid, expiryTime: expiryStr } = JSON.parse(storedUserData);
      const expiryTime = new Date(expiryStr);

      if (expiryTime <= new Date() || !token || !uid) {
        console.log("Token expired");
        dispatch(setAutoLoginAttempted());
        return;
      }

      // Get user data from firebase
      const userData = await fetchUserData(uid);

      // Dispatch login action
      dispatch(login({ token: token, userData }));
    };
    attemptAuth();
  }, [dispatch]);

  return (
    <View style={Styles.center}>
      <ActivityIndicator
        size="large"
        color={colours.primary}
        aria-label="Loading Indicator"
      />
    </View>
  );
};

export default StartUp;
