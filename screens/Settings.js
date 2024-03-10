// Libray Imports
import React, { useCallback, useReducer, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

// Local Imports
import ScreenTitle from "../components/ScreenTitle";
import PageContainter from "../components/PageContainer";
import { validateFormEntry } from "../utils/FormActions";
import { reducerFn } from "../utils/FormReducer";
import Input from "../components/Input";
import colours from "../constants/Colours";
import SubmitFormButton from "../components/SubmitFormButton";
import { updateUserData, signOut } from "../utils/AuthActions";
import { updateCurrentUserData } from "../store/authSlice";
import ProfilePicture from "../components/ProfilePicture";

// Settings Screen
const Settings = (props) => {
  const userData = useSelector((state) => state.auth.userData); // User data from redux store
  const [loading, setLoading] = useState(false); // Loading state
  const [displaySuccessMsg, setDisplaySuccessMsg] = useState(null); // Success message state
  const dispatch = useDispatch(); // Redux dispatch function
  const { firstName, lastName, email, bio } = userData || ""; // User data fields

  // Default form state (invalid and empty)
  const defaultFormState = {
    values: {
      firstName,
      lastName,
      email,
      bio,
    },
    inputValidState: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      bio: undefined,
    },
    formValid: false,
  };

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

  // Handler for saving updated form data to firebase and local storage
  const saveFormHandler = useCallback(async () => {
    const updatedFormValues = formState.values;
    try {
      setLoading(true);
      await updateUserData(userData.uid, updatedFormValues);
      dispatch(updateCurrentUserData({ updatedData: updatedFormValues }));
      setDisplaySuccessMsg(true);
      setTimeout(() => setDisplaySuccessMsg(false), 2500);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [formState, dispatch]);

  // Check if any form fields have changed
  const formStateChanged = () => {
    const currFormState = formState.values;

    return (
      currFormState.firstName !== userData.firstName ||
      currFormState.lastName !== userData.lastName ||
      currFormState.email !== userData.email ||
      currFormState.bio !== userData.bio
    );
  };

  return (
    <PageContainter>
      <ScreenTitle>Settings</ScreenTitle>
      <ScrollView contentContainerStyle={styles.settingsFormContainer}>
        <ProfilePicture
          size={80}
          uid={userData.uid}
          uri={userData.profilePicture}
          showEditIcon={true}
        />

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
          initialValue={userData.lastName}
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
          initialValue={userData.email}
          onInputChanged={formFieldChangedHandler}
          keyboardType="email-address"
          autoCapitalize="none"
          errorText={formState.inputValidState["email"]}
          icon="mail-outline"
          iconPack={Ionicons}
          iconSize={20}
          iconColor={colours.blue}
        />
        <Input /* Bio field */
          label="Bio"
          id="bio"
          initialValue={userData.bio}
          onInputChanged={formFieldChangedHandler}
          autoCapitalize="none"
          errorText={formState.inputValidState["bio"]}
          icon="information-circle-outline"
          iconPack={Ionicons}
          iconSize={20}
          iconColor={colours.blue}
        />
        <View style={{ marginTop: 20 }}>
          {
            /* Success message */
            displaySuccessMsg && (
              <Text style={{ color: colours.primary, marginTop: 10 }}>
                Changes saved successfully.
              </Text>
            )
          }

          {
            /* Loading indicator if submit has been pressed */
            loading ? (
              <ActivityIndicator
                size="small"
                color={colours.primary}
                style={{ marginTop: 10 }}
              />
            ) : (
              formStateChanged() && (
                <SubmitFormButton /* Render Save button if fields have changed */
                  title="Save Changes"
                  style={{ marginTop: 20 }}
                  onPress={saveFormHandler}
                  disabled={!formState.formValid}
                />
              )
            )
          }
        </View>

        <SubmitFormButton /* Sign Out */
          title="Sign Out"
          style={{ marginTop: 20 }}
          onPress={() => dispatch(signOut())}
          color={colours.red}
        />
      </ScrollView>
    </PageContainter>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsFormContainer: {
    alignItems: "center",
  }
});

export default Settings;
