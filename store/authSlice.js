// Library Imports
import { createSlice } from "@reduxjs/toolkit"
import { updateUserData } from "../utils/AuthActions";

// Generates a slice object with the initial state,
// reducer functions, and action creators
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userData: null,
    autoLoginAttempted: false,
  },
  reducers: {
    login: (state, action) => {
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
      state.autoLoginAttempted = true;
    },
    logout: (state, action) => {
      state.userData = null;
      state.token = null;
      state.autoLoginAttempted = false;
    },
    setAutoLoginAttempted: (state, action) => {
      state.autoLoginAttempted = true;
    },
    updateCurrentUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload.updatedData };
    }
  },
});

export const { login, logout, setAutoLoginAttempted, updateCurrentUserData } = authSlice.actions;
export default authSlice.reducer;