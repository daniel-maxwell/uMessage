// Library Imports
import React, { useCallback, useReducer } from "react";
import { Ionicons } from "@expo/vector-icons";

// Local Imports
import Input from "./Input";
import colours from "../constants/Colours";
import SubmitFormButton from "../components/SubmitFormButton";
import { validateFormEntry } from "../utils/FormActions";
import { reducerFn } from "../utils/FormReducer";

// All form fields are initially invalid
const defaultFormState = {
  values: {
    email: "",
    password: "",
  },
  inputValidState: {
    email: false,
    password: false,
  },
  formValid: false,
};

// Sign In Form Component
const SignIn = () => {
  const [formState, dispatchFormState] = useReducer(
    reducerFn,
    defaultFormState
  );

  // Handler for form field changes
  const formFieldChangedHandler = useCallback(
    (inputIdentifier, inputValue) => {
      const res = validateFormEntry(inputIdentifier, inputValue);
      dispatchFormState({
        inputId: inputIdentifier,
        validationRes: res,
        inputValue: inputValue,
      });
    },
    [dispatchFormState]
  );

  return (
    <>
      <Input /* E-mail field */
        label="E-mail"
        id="email"
        keyboardType="email-address"
        onInputChanged={formFieldChangedHandler}
        errorText={formState.inputValidState["email"]}
        icon="mail-outline"
        iconPack={Ionicons}
        iconSize={20}
        iconColor={colours.blue}
      />
      <Input /* Password field */
        label="Password"
        id="password"
        secureTextEntry={true} // Hides the text
        onInputChanged={formFieldChangedHandler}
        errorText={formState.inputValidState["password"]}
        icon="lock-closed-outline"
        iconPack={Ionicons}
        iconSize={20}
        iconColor={colours.blue}
      />
      <SubmitFormButton /* Submit */
        title="Sign In"
        style={{ marginTop: 20 }}
        onPress={() => console.log("Sign In")}
        disabled={!formState.formValid}
      />
    </>
  );
};

export default SignIn;
