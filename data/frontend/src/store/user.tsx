import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserState {
  username: string;
  isPlaying: boolean;
  isInMatchmaking: boolean;
  blockedUsers: string[];
}

const initialState: UserState = {
  username: "",
  isPlaying: false,
  isInMatchmaking: false,
  blockedUsers: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state) => {
      state.blockedUsers = [];
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setIsInMatchmaking: (state, action: PayloadAction<boolean>) => {
      state.isInMatchmaking = action.payload;
    },
    addBlockedUser: (state, action: PayloadAction<string>) => {
      const nbr = state.blockedUsers.indexOf(action.payload);
      if (nbr === -1) state.blockedUsers.push(action.payload);
    },
    removeBlockedUser: (state, action: PayloadAction<string>) => {
      const index = state.blockedUsers.indexOf(action.payload);
      if (index !== -1) state.blockedUsers.splice(index, 1);
    },
    updateBlockedUsers: (state, action: PayloadAction<{ oldName: string, newName: string }>) => {
      const blockedUser = state.blockedUsers.findIndex((obj) => obj === action.payload.oldName);
      if (blockedUser !== -1) {
        state.blockedUsers[blockedUser] = action.payload.newName;
      }
    },
  },
});

export const {
  login,
  setUsername,
  addBlockedUser,
  removeBlockedUser,
  setIsPlaying,
  setIsInMatchmaking,
  updateBlockedUsers,
} = userSlice.actions;
export default userSlice.reducer;
