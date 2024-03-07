// Library imports
import { getFirebase } from "./FirebaseIntegration";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDatabase, ref, set, child } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Local imports
import { login } from "../store/authSlice";

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
      const userData = await createUser(firstName, lastName, email, uid);

      // Dispatch login action and save user data to async storage
      dispatch(login({ token, userData }));
      saveUserData(token, uid, expiryTime);

    } catch (error) { // Set error message based on error code and throw
      console.log(error)
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
  }
};

// Creates a user in the database, or throws an error
const createUser = async (firstName, lastName, email, uid) => {
  const fullName = `${firstName} ${lastName}`.toLowerCase();
  const userDetails = {
    fullName,
    firstName,
    lastName,
    email,
    uid,
    signUpDate: new Date().toISOString(),
  };

  const databaseRef = ref(getDatabase());
  const childRef = child(databaseRef, `users/${uid}`);
  await set(databaseRef, userDetails);
  return userDetails;
};

// Saves user data to async storage
const saveUserData = async (token, uid, expiryTime) => {
  AsyncStorage.setItem("userData", JSON.stringify({
    token,
    uid,
    expiryTime: expiryTime.toISOString()
  }));
};
