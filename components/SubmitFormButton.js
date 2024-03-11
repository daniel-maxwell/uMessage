// Library Imports
import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

// Local Imports
import colours from '../constants/Colours';

//
const SubmitForm = (props) => {

  const enabledColour = props.color || colours.primary;
  const disabledColour = colours.lightGrey;
  const bgColor = props.disabled ? disabledColour : enabledColour;

  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        ...props.style,
        ...{ backgroundColor: bgColor}
      }}
      onPress={props.disabled ? () => {} : props.onPress}>
        <Text
          style={{color: props.disabled ? colours.grey : 'white'}}>
            { props.title }
        </Text>
    </TouchableOpacity>
  )
}

// Styles
const styles = StyleSheet.create({
  button: {
    backgroundColor: colours.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default SubmitForm;