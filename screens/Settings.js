// Libray Imports
import React, { useCallback, useReducer } from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';


// Local Imports
import ScreenTitle from '../components/ScreenTitle';
import PageContainter from '../components/PageContainer';
import { validateFormEntry } from '../utils/FormActions';
import { reducerFn } from '../utils/FormReducer';
import Input from '../components/Input';
import colours from '../constants/Colours';


// Default form state (invalid and empty)
const defaultFormState = {
  values: {
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  },
  inputValidState: {
    firstName: false,
    lastName: false,
    email: false,
    bio: false,
  },
  formValid: false,
};

// Settings Screen
const Settings = (props) => {

  const userData = useSelector(state => state.auth.userData);

  const [formState, dispatchFormState] = useReducer(
    reducerFn,
    defaultFormState
  );

  console.log(formState.formValid)



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


  return <PageContainter>
    <ScreenTitle>Settings</ScreenTitle>
      <Input /* First Name field */
          label="First Name"
          id="firstName"
          initialValue={userData.firstName}
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
        <Input /* Bio field */
          label="Bio"
          id="bio"
          onInputChanged={formFieldChangedHandler}
          autoCapitalize="none"
          errorText={formState.inputValidState["bio"]}
          icon="information-circle-outline"
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
  </PageContainter>
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Settings;
