// Library Imports
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Local Imports
import PageContainer from "../components/PageContainer";
import logo from "../assets/images/logo.png";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import colours from "../constants/Colours";

// Login / Authentication Screen
const Auth = (props) => {
  /* State to manage whether the user is signing up or signing in */
  const [isSignedUp, setIsSignedUp] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageContainer>
        <ScrollView /* Scroll View for smaller screens */>
          <KeyboardAvoidingView /* Keyboard Avoiding View for smaller screens */
            behaviour={Platform.OS === "ios" ? "height" : undefined}
            keyboardVerticalOffset={100}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.imageContainer}>
              <Image
                /* Header Logo Image */
                source={logo}
                style={styles.image}
                aria-label="Main Logo Image"
              />
            </View>
            {
              /* Conditional rendering of sign in / sign up forms */
              isSignedUp ? <SignIn /> : <SignUp />
            }
            <TouchableOpacity /* Change form link */
              onPress={() => setIsSignedUp(!isSignedUp)}
              style={styles.changeFormContainer}
              aria-label="Button to change form type"
            >
              <Text style={styles.changeFormLink}>
                {`Switch to ${isSignedUp ? "Sign Up" : "Sign In"}`}
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </PageContainer>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  changeFormContainer: {
    justifyContent: "center",
    marginVertical: 15,
    alignItems: "center",
  },
  changeFormLink: {
    color: colours.blue,
    fontFamily: "medium",
    letterSpacing: 0.3,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "50%",
    resizeMode: "contain",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
  },
});

export default Auth;
