// Library Imports
import { createSlice } from "@reduxjs/toolkit"

// Generates a messages slice object with the initial state,
// reducer functions, and action creators
const messagesSlice = createSlice({
  name: "conversations",
  initialState: {
    messagesData: {},
  },
  reducers: {
    setConversationMessages: (state, action) => { // Adds new messages to redux store
      // Gets the current conversation history from the store
      const conversationHistory = state.messagesData;

      // Gets the conversation id and new messages data from the action payload
      const { conversationId, messagesData } = action.payload;

      // Adds the new messages data to the conversation history
      conversationHistory[conversationId] = messagesData;

      // Updates the conversation history in the store
      state.messagesData = conversationHistory;
    }
  },
});

export const { setConversationMessages } = messagesSlice.actions;
export default messagesSlice.reducer;