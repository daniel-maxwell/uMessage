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

    return userSnapshot.val();
  } catch (error) {
    throw new Error("Woops! Something went wrong.");
  }
}
