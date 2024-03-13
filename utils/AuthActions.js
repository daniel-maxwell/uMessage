// Library imports
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set, child, update } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Updates from 'expo-updates';

// Local imports
import { login, logout } from "../store/authSlice";
import { fetchUserData } from "./UserActions";
import { getFirebase } from "./FirebaseIntegration";

// Timer for auto-logout when token expires
let logoutTimer;

// Signs user up and creates a user in the database, or throws an error
export const signUp = (firstName, lastName, email, password) => {
  return async (dispatch) => {
    const app = getFirebase();
    const auth = getAuth(app);

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get user data
      const { uid, stsTokenManager } = userCredential.user;
      const token = stsTokenManager.accessToken;
      const expiryTime = new Date(stsTokenManager.expirationTime);
      const millisUntilExpiry = expiryTime - new Date();
      const userData = await createUser(firstName, lastName, email, uid);

      // Dispatch login action and save user data to async storage
      dispatch(login({ token, userData }));
      saveUserData(token, uid, expiryTime);
      savePushToken(userData)

      // Set auto-logout timer
      logoutTimer = setTimeout(() => {
        dispatch(logout());
      }, millisUntilExpiry);
    } catch (error) {
      // Set error message based on error code and throw
      const errorCode = error.code;
      let message = "Woops! Something went wrong.";
      if (errorCode === "auth/email-already-in-use") {
        message = "E-mail already in use.";
      } else if (errorCode === "auth/invalid-email") {
        message = "Invalid e-mail.";
      } else if (errorCode === "auth/weak-password") {
        message = "Weak password.";
      } else if (
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/user-not-found"
      ) {
        message = "E-mail or password is incorrect. Please try again.";
      }
      throw new Error(message);
    }
  };
};

// Signs user in and saves user data to async storage, or throws an error
export const signIn = (email, password) => {
  return async (dispatch) => {
    const app = getFirebase();
    const auth = getAuth(app);

    try {
      // Create user in Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get user data
      const { uid, stsTokenManager } = userCredential.user;
      const token = stsTokenManager.accessToken;
      const expiryTime = new Date(stsTokenManager.expirationTime);
      const millisUntilExpiry = expiryTime - new Date();
      const userData = await fetchUserData(uid);

      // Dispatch login action and save user data to async storage
      dispatch(login({ token: token, userData }));
      saveUserData(token, uid, expiryTime);
      await savePushToken(userData)

      // Set auto-logout timer
      logoutTimer = setTimeout(() => {
        dispatch(logout());
      }, millisUntilExpiry);
    } catch (error) {
      // Set error message based on error code and throw
      const errorCode = error.code;
      let message = "Woops! Something went wrong.";
      if (errorCode === "auth/email-already-in-use") {
        message = "E-mail already in use.";
      } else if (errorCode === "auth/invalid-email") {
        message = "Invalid e-mail.";
      } else if (errorCode === "auth/weak-password") {
        message = "Weak password.";
      }
      throw new Error(message);
    }
  };
};

// Creates a user in the database, or throws an error
const createUser = async (firstName, lastName, email, uid) => {
  const fullName = `${firstName} ${lastName}`.toLowerCase();
  const userData = {
    fullName,
    firstName,
    lastName,
    email,
    uid,
    signUpDate: new Date().toISOString(),
  };

  const databaseRef = ref(getDatabase());
  const childRef = child(databaseRef, `users/${uid}`);
  await set(childRef, userData);
  return userData;
};

// Saves user data to async storage
const saveUserData = async (token, uid, expiryTime) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      uid,
      expiryTime: expiryTime.toISOString(),
    })
  );
};

// Updates user data in the database
export const updateUserData = async (uid, updatedData) => {
  if (updatedData.firstName && updatedData.lastName) {
    const fullName =
      `${updatedData.firstName} ${updatedData.lastName}`.toLowerCase();
    updatedData.fullName = fullName;
  }
  const databaseRef = ref(getDatabase());
  const childRef = child(databaseRef, `users/${uid}`);
  await update(childRef, updatedData);
};

// Signs user out
export const signOut = () => {
  return async (dispatch) => {
    // Clear async storage, log out timer and log out
    AsyncStorage.clear();
    clearTimeout(logoutTimer);
    dispatch(logout());
    await Updates.reloadAsync()
  };
};

// Saves the user's push notification token to the database
const savePushToken = async (userData) => {
  if (!Device.isDevice) return; // Users must use a real device to get a push token

  // Gets push token
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })
  ).data;

  const tokenData = userData.pushTokens || {}; // Get the user's saved push tokens (if any)
  const tokenArr = Object.values(tokenData); // Convert the object to an array

  if (tokenArr.includes(token)) return; // If the token is already saved, skip

  tokenArr.push(token); // Add the new token to the array

  // Convert the array back to an object
  for (let i = 0; index < tokenArr.length; index++) {
    tokenData[i] = tokenArr[i];
  }

  // Firebase prerequisites
  const app = getFirebase();
  const databaseRef = ref(getDatabase(app));
  const userRef = child(databaseRef, "users/" + userData.uid + "/pushTokens");

  // Save the user's push tokens to the database
  await set(userRef, tokenData);
};
