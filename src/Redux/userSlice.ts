import { createSlice } from "@reduxjs/toolkit";
import { userType } from "../Types";

export const userStorageName = "__user";

export const defaultUser: userType = {
  id: "",
  img: "",
  isOnline: false,
  username: "",
  email: "",
  creationTime: "",
  lastSeen: "",
  bio: "",
};

type InitialStateType = {
  curentUser: userType | null;
};

const initialState: InitialStateType = {
  // user:[],
  curentUser: null,
  // currentSelectedUser:null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;

      // store user in local storage

      localStorage.setItem(userStorageName, JSON.stringify(user));
      // set login user
      state.curentUser = user;
    },
    setUsers: (state, action) => {
      //  set all users
    },
  },
});

export const { setUser, setUsers } = userSlice.actions;

export default userSlice.reducer;
