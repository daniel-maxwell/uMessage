// Library imports
import { getFirebase } from "./FirebaseIntegration";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDatabase, ref, set, child } from "firebase/database";

// Signs user up and creates a user in the database, or throws an error
export const signUp = async (firstName, lastName, email, password) => {
  const app = getFirebase();
  const auth = getAuth(app);
  try {
    // Sign up the user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { uid } = userCredential.user;
    await createUser(firstName, lastName, email, uid);

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
};

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
