// Library Imports
import { createSlice } from "@reduxjs/toolkit"

// Generates a users slice object with the initial state,
// reducer functions, and action creators
const conversationSlice = createSlice({
  name: "conversations",
  initialState: {
    conversationsData: {},
  },
  reducers: {
    setConversationsData: (state, action) => { // Adds new users to redux store
      state.conversationsData = action.payload.conversationsData
    }
  },
});

export const { setConversationsData } = conversationSlice.actions;
export default conversationSlice.reducer;