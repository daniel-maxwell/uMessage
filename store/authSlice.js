// Library Imports
import { createSlice } from "@reduxjs/toolkit"

// Generates an authentication slice object with the
// initial state, reducer functions, and action creators
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userData: null,
    autoLoginAttempted: false,
  },
  reducers: {
    login: (state, action) => { // Logs user in
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
      state.autoLoginAttempted = true;
    },
    logout: (state, action) => { // Logs user out
      state.userData = null;
      state.token = null;
      state.autoLoginAttempted = false;
    },
    setAutoLoginAttempted: (state, action) => { // Sets auto login attempted
      state.autoLoginAttempted = true;
    },
    updateCurrentUserData: (state, action) => { // Updates user data
      state.userData = { ...state.userData, ...action.payload.updatedData };
    }
  },
});

export const { login, logout, setAutoLoginAttempted, updateCurrentUserData } = authSlice.actions;
export default authSlice.reducer;