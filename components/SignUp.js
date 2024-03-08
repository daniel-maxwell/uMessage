// Library Imports
import React, { useCallback, useReducer, useState, useEffect } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

// Local Imports
import Input from "./Input";
import colours from "../constants/Colours";
import SubmitFormButton from "./SubmitFormButton";
import { validateFormEntry } from "../utils/FormActions";
import { reducerFn } from "../utils/FormReducer";
import { signUp } from "../utils/AuthActions";

// Default form state (invalid and empty)
const defaultFormState = {
  values: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
  inputValidState: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  formValid: false,
};

// Sign Up Form Component
const SignUp = (props) => {
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [formState, dispatchFormState] = useReducer(
    reducerFn,
    defaultFormState
  );
  const dispatch = useDispatch();

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

  // If error occurs, display an on-screen alert
  useEffect(() => {
    if (error) {
      Alert.alert("Woops! An error occurred.", error, [{ text: "OK" }]);
    }
  }, [error]);

  // Handler for form submission
  const submitFormHandler = useCallback(async () => {
    setLoading(true); // Enter loading state

    // Check if form state or input values are undefined
    if (!formState || !formState.values) {
      console.error("Form state or values are undefined.");
      setLoading(false);
      return;
    }

    // Destructure input values
    const { firstName, lastName, email, password } = formState.values;

    // Check if one or more fields are empty
    if (!firstName || !lastName || !email || !password) {
      console.error("One or more form fields are empty.");
      setLoading(false);
      return;
    }
    // Attempt to sign up
    try {
      setError(null);
      await dispatch(signUp(firstName, lastName, email, password));
    }
    // If error occurs, set error message and exit loading state
    catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [dispatch, formState]);

  // Render form fields and submit button
  return (
    <>
      <Input /* First Name field */
        label="First Name"
        id="firstName"
        onInputChanged={formFieldChangedHandler}
        autoCapitalize="none"
        errorText={formState.inputValidState["firstName"]}
        icon="person-outline"
        iconPack={Ionicons}
        iconSize={20}
        iconColor={colours.blue}
      />
      <Input /* Last Name field */
        label="Last Name"
        id="lastName"
        onInputChanged={formFieldChangedHandler}
        autoCapitalize="none"
        errorText={formState.inputValidState["lastName"]}
        icon="person-outline"
        iconPack={Ionicons}
        iconSize={20}
        iconColor={colours.blue}
      />
      <Input /* E-mail field */
        label="E-mail"
        id="email"
        onInputChanged={formFieldChangedHandler}
        keyboardType="email-address"
        autoCapitalize="none"
        errorText={formState.inputValidState["email"]}
        icon="mail-outline"
        iconPack={Ionicons}
        iconSize={20}
        iconColor={colours.blue}
      />
      <Input /* Password field */
        label="Password"
        id="password"
        onInputChanged={formFieldChangedHandler}
        secureTextEntry={true} // Hides text
        autoCapitalize="none"
        errorText={formState.inputValidState["password"]}
        icon="lock-closed-outline"
        iconPack={Ionicons}
        iconSize={20}
        iconColor={colours.blue}
      />
      {
        loading ? (    /* Loading indicator if submit has been pressed */
        <ActivityIndicator
          size="small"
          color={colours.primary}
          style={{ marginTop: 10 }}
        />
      ) : (
        <SubmitFormButton /* Submit */
          title="Sign Up"
          style={{ marginTop: 20 }}
          onPress={submitFormHandler}
          disabled={!formState.formValid}
        />
      )}
    </>
  );
};

export default SignUp;
