// Library imports
import { getDatabase,
         ref,
         get,
         child,
         query,
         orderByChild,
         startAt,
         endAt }
from "firebase/database";

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

export const searchForUsers = async (searchString) => {
  const searchQuery = searchString.toLowerCase();

  try {
    const app = getFirebase();
    const databaseRef = ref(getDatabase(app));
    const userRef = child(databaseRef, 'users');
    const queryRef = query(
                            userRef,
                            orderByChild('fullName'),
                            startAt(searchQuery),
                            endAt(searchQuery + '\uf8ff')
    );
    const userSnapshot = await get(queryRef);
    if (userSnapshot.exists()) {
      return userSnapshot.val();
    }
    return {};
  } catch (error) {
    console.log(error);
    throw new Error("Woops! Something went wrong.");
  }
}
