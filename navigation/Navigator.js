// Library imports
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";

// Local imports
import HomeNavigator from "./HomeNavigator";
import SignUp from "../screens/Auth";
import Auth from "../screens/Auth";
import StartUp from "../screens/StartUp";

const Navigator = (props) => {
  const isLoggedIn = useSelector(
    (state) => state.auth.token !== "" && state.auth.token !== null
  );
  const autoAuthAttempted = useSelector((state) => state.auth.autoAuthAttempted);

  return (
    <NavigationContainer>
      {isLoggedIn && <HomeNavigator />}
      {!isLoggedIn && autoAuthAttempted && <Auth />}
      {!isLoggedIn && !autoAuthAttempted && <StartUp />}
    </NavigationContainer>
  );
};

export default Navigator;
