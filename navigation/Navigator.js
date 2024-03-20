// Library imports
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";

// Local imports
import HomeNavigator from "./HomeNavigator";
import Auth from "../screens/Auth";
import StartUp from "../screens/StartUp";

// Main Navigator Component, handles navigation based on user authentication status
const Navigator = (props) => {
  // Get user authentication status from redux store
  const isLoggedIn = useSelector(
    (state) => state.auth.token !== "" && state.auth.token !== null
  );

  // Get auto login attempted status from redux store
  const autoLoginAttempted = useSelector((state) => state.auth.autoLoginAttempted);

  // If not logged & auto login has been attempted, show Auth
  // If not logged & auto login not attempted, show StartUp
  return (
    <NavigationContainer>
      {isLoggedIn && <HomeNavigator />}
      {!isLoggedIn && autoLoginAttempted && <Auth />}
      {!isLoggedIn && !autoLoginAttempted && <StartUp />}
    </NavigationContainer>
  );
};

export default Navigator;
