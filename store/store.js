// Library imports
import { configureStore } from "@reduxjs/toolkit";

// Local imports
import authSlice from "./authSlice";
import userSlice from "./userSlice";
import conversationSlice from "./conversationSlice";
import messagesSlice from "./messagesSlice";

// Configures the Redux store with reducer logic
export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: userSlice,
    conversations: conversationSlice,
    messages: messagesSlice,
  },
});
