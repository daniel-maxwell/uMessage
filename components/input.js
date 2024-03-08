// Library Imports
import { View, StyleSheet, TextInput, Text } from "react-native";

// Local Imports
import colours from "../constants/Colours";

// Login Input Component
const Input = (props) => {

  const onChangeText = (text) => {
    props.onInputChanged(props.id, text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.inputContainer}>
        {
          props.icon &&
          <props.iconPack
            name={props.icon}
            size={props.iconSize || 15}
            style={styles.icon}
          />
        }
        <TextInput
          { ...props }
          style={styles.input}
          onChangeText={onChangeText}
        />
      </View>
      {
        props.errorText &&
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText[0]}</Text>
        </View>
      }
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginVertical: 8,
    fontFamily: 'bold',
    letterSpacing: 0.3,
    fontSize: 18,
    color: colours.textColour,
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 2,
    backgroundColor: colours.offWhite,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
    color: colours.grey,
  },
  input: {
    flex: 1,
    fontFamily: 'medium',
    letterSpacing: 0.3,
    color: colours.textColour,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    fontFamily: 'medium',
    letterSpacing: 0.3,
  },

});

export default Input;