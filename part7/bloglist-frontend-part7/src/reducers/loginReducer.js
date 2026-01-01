import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";

const loginSlice = createSlice({
  name: "login",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const { setUser, clearUser } = loginSlice.actions;

export const loginUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials);
    window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
    dispatch(setUser(user));
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(clearUser());
  };
};

export default loginSlice.reducer;
