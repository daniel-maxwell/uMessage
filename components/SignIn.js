// Library Imports
import React, { useCallback, useReducer, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Alert, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";

// Local Imports
import Input from "./Input";
import colours from "../constants/Colours";
import SubmitFormButton from "../components/SubmitFormButton";
import { validateFormEntry } from "../utils/FormActions";
import { reducerFn } from "../utils/FormReducer";
import { signIn } from "../utils/AuthActions";

// Test mode auto fills form fields to sign in with test user account
const testMode = true;

// All form fields are initially invalid
const defaultFormState = {
  values: {
    email: testMode ? "testuser@example.com" : "",
    password: testMode ? "testpass" : "",
  },
  inputValidState: {
    email: testMode ? true : false,
    password: testMode ? true : false,
  },
  formValid: testMode ? true : false,
};

// Sign In Form Component
const SignIn = props => {
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
      Alert.alert("Woops! An error occurred.", error);
    }
  }, [error]);

  // Handler for form submission
  const submitFormHandler = useCallback( async () => {
    // Enter loading state
    setLoading(true);

    // Check if form state or values are undefined
    if (!formState) {
      console.error("Form state or values are undefined.");
      setLoading(false);
      return;
    }

    // Get e-mail and password from form state
    const { email, password } = formState.values;

    // Check if e-mail or password are empty
    if (!email || !password) {
      console.error("One or more fields are empty.");
      setLoading(false);
      return;
    }

    // Attempt to sign in
    try {
      setError(null);
      await dispatch(signIn(email, password));
    }
    // Set error message based on error code and exit loading state
    catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input /* E-mail field */
        label="E-mail"
        id="email"
        aria-label="E-mail field"
        initialValue={formState.values.email}
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
        aria-label="Password field"
        initialValue={formState.values.password}
        secureTextEntry={true} // Hides the text
        onInputChanged={formFieldChangedHandler}
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
            aria-label="Loading Indicator"
            color={colours.primary}
            style={{ marginTop: 10 }}
          />
        ) : (
          <SubmitFormButton /* Submit */
            title="Sign In"
            aria-label="Sign In Button"
            style={{ marginTop: 20 }}
            onPress={() => submitFormHandler()}
            disabled={!formState.formValid}
          />
        )}
    </>
  );
};

export default SignIn;
