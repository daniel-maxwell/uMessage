// Library imports
import { configureStore } from "@reduxjs/toolkit";

// Local imports
import authSlice from "./authSlice";

// Configures the Redux store with reducer logic
export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});
