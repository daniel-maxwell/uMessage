// Library imports
import { getDatabase, ref, push, child } from "firebase/database";

// Local imports
import { getFirebase } from "./FirebaseIntegration";

// Creates a new conversation
export const createNewConversation = async (currentUserId, conversationData) => {
  const newConversationData = {
    ...conversationData,
    createdBy: currentUserId, // Who created the chat?
    updatedBy: currentUserId, // Who last updated the chat?
    createdAt: new Date().toISOString(), // When was the chat created?
    updatedAt: new Date().toISOString(), // When was the chat last updated?
  };
  // Push new conversation data to database
  const app = getFirebase();
  const databaseRef = ref(getDatabase(app));
  const newConversation = await push(child(databaseRef, 'Conversations'), newConversationData);
  const participants = conversationData.users;

  // Push the user id's as participants to the conversation to the database
  for (const uid of participants) {
    await push(child(databaseRef, "userChats/" + uid), newConversation.key);
  }
};
