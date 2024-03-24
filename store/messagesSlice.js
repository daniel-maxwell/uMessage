// Library Imports
import { createSlice } from "@reduxjs/toolkit";

// Generates a messages slice object with the initial state,
// reducer functions, and action creators
const messagesSlice = createSlice({
  name: "conversations",
  initialState: {
    messagesData: {},
    likedMessages: {},
  },
  reducers: {
    setConversationMessages: (state, action) => {
      // Adds new messages to redux store
      // Gets the current conversation history from the store
      const conversationHistory = state.messagesData;

      // Gets the conversation id and new messages data from the action payload
      const { conversationId, messagesData } = action.payload;

      // Adds the new messages data to the conversation history
      conversationHistory[conversationId] = messagesData;

      // Updates the conversation history in the store
      state.messagesData = conversationHistory;
    },
    addLikedMessage: (state, action) => {
      // Adds a liked message to the redux store
      const { likedMessageData } = action.payload; // Gets the liked message data from the action payload
      state.likedMessages[likedMessageData.messageId] = likedMessageData; // Adds the liked message to the store
    },
    removeLikedMessage: (state, action) => {
      // Removes a liked message from the redux store
      const { messageId } = action.payload; // Gets the message id from the action payload
      delete state.likedMessages[messageId]; // Removes the liked message from the store
    },
    setLikedMessages: (state, action) => {
      // Removes a liked message from the redux store
      const { likedMessages } = action.payload; // Gets the message id from the action payload
      state.likedMessages = { ...likedMessages }; // Removes the liked message from the store
    },
  },
});

export const {
  setConversationMessages,
  addLikedMessage,
  removeLikedMessage,
  setLikedMessages,
} = messagesSlice.actions;
export default messagesSlice.reducer;
