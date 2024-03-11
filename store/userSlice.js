// Library Imports
import { createSlice } from "@reduxjs/toolkit"

// Generates a users slice object with the initial state,
// reducer functions, and action creators
const userSlice = createSlice({
  name: "users",
  initialState: {
    savedUsers: {},
  },
  reducers: {
    setSavedUsers: (state, action) => { // Adds new users to redux store
      const newUsers = action.payload.newUsers;
      const storedUsers = state.savedUsers;
      const users = Object.values(newUsers);
      for (let i = 0; i < users.length; i++) storedUsers[users[i].uid] = users[i];
      state.savedUsers = storedUsers
    }
  },
});

export const { setSavedUsers } = userSlice.actions;
export default userSlice.reducer;