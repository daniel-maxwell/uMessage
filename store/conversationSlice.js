// Library Imports
import { createSlice } from "@reduxjs/toolkit"

// Generates a conversation slice object with the initial state,
// reducer functions, and action creators
const conversationSlice = createSlice({
  name: "conversations",
  initialState: {
    conversationsData: {},
  },
  reducers: {
    setConversationsData: (state, action) => { // Adds conversations to redux store
      state.conversationsData = { ...action.payload.conversationsData };
    }
  },
});

export const { setConversationsData } = conversationSlice.actions;
export default conversationSlice.reducer;