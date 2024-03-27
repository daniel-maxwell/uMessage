// Library imports
import { getDatabase, ref, push, child, update, get, set, remove } from "firebase/database";

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

// Sends a message from one user to another
const sendMessage = async (conversationId, senderId, messageContents, imgUrl, replyTo) => {
    // Firebase prerequisites
    const app = getFirebase();
    const databaseRef = ref(getDatabase(app));

    // Create a reference for the message
    const msgRef = child(databaseRef, "messages/" + conversationId);

    // Create the message data object
    const messageData = {
      sender: senderId,
      sentAt: new Date().toISOString(),
      text: messageContents
    };

    // If there is a replyTo value, add it to the message data
    if (replyTo) {
      messageData.replyTo = replyTo;
    }

    // If there is an image URL, add it to the message data
    if (imgUrl) {
      messageData.imgUrl = imgUrl;
    }

    // Push the message to the database
    await push(msgRef, messageData);

    // Update the conversation's updated time and user
    const conversationRef = child(databaseRef, "Conversations/" + conversationId);
    await update(conversationRef, {
      updatedAt: new Date().toISOString(),
      updatedBy: senderId,
      lastMessage: messageContents
    });

}

// Sends a (text-only) message from one user to another
export const sendMessageTextOnly = async (conversationId, senderId, messageContents, replyTo) => {
  await sendMessage(conversationId, senderId, messageContents, null, replyTo);
};

export const likeMessage = async (messageId, conversationId, userId) => {
  try {
    const app = getFirebase();
    const databaseRef = ref(getDatabase(app));
    const childRef = child(databaseRef, `userLikedMessages/${userId}/${conversationId}/${messageId}`);
    const snapshot = await get(childRef);
    if (snapshot.exists()) {
      // Liked item exists - un-like it
      await remove(childRef);
    }
    else {
      // Liked item does not exist - like it
      const likedMessageData = {
        messageId: messageId,
        conversationId: conversationId,
        likedAt: new Date().toISOString()
      }

      await set(childRef, likedMessageData);
    }
  }
  catch (error) {
    alert("Error liking message: " + error.message);
  }
};

// Sends a message with an image from one user to another
export const sendMessageWithImage = async (conversationId, senderId, imgUrl) => {
  await sendMessage(conversationId, senderId, 'Image', imgUrl, null);
}
