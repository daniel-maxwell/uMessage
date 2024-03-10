// Library Imports
import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

// Local Imports
import Colours from "../constants/Colours";

// Custom Header Button Prototype
const CustomHeaderButton = (props) => {
  return <HeaderButton {...props} IconComponent={Ionicons} iconSize={
    23} color={props.color ? props.color : Colours.blue}
  />;
};

export default CustomHeaderButton;
