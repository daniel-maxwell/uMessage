// Library imports
import { getDatabase, ref, get, child } from "firebase/database";

// Local imports
import { getFirebase } from "./FirebaseIntegration";

// Fetches user data from the database, or throws an error
export const fetchUserData = async (uid) => {
  try {
    // Get user data from database
    const app = getFirebase();
    const databaseRef = ref(getDatabase(app));
    const userRef = child(databaseRef, `users/${uid}`);
    const userSnapshot = await get(userRef);

    /*
    // Return user data if it exists, else throw error
    if (userSnapshot.exists()) {
      return userSnapshot.val();
    } else {
      throw new Error("User not found.");
    }
    */
    return userSnapshot.val();
  } catch (error) {
    throw new Error("Woops! Something went wrong.");
  }
}
