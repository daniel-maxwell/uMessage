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
  const isLoggedIn = useSelector(
    (state) => state.auth.token !== "" && state.auth.token !== null
  );
  const autoLoginAttempted = useSelector((state) => state.auth.autoLoginAttempted);

  return (
    <NavigationContainer>
      {isLoggedIn && <HomeNavigator />}
      {!isLoggedIn && autoLoginAttempted && <Auth />}
      {!isLoggedIn && !autoLoginAttempted && <StartUp />}
    </NavigationContainer>
  );
};

export default Navigator;
