// Library Imports
import { View, StyleSheet, TextInput, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';

// Local Imports
import colours from "../constants/colours";

// Login Input Component
const Input = (props) => {
  return (
    <View style={styles.container}>
      <Text>{props.label}</Text>
      <View style={styles.inputContainer}>
        {
          props.icon &&
          <props.iconPack
            name={props.icon}
            size={props.iconSize || 15}
            style={styles.icon}
          />
        }
        <TextInput />
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    width: "100%",
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
    fontSize: 16,
    color: colours.black,
  },
});

export default Input;