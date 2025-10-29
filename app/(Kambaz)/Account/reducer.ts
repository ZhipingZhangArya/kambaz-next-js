import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
  }
  return null;
};

const initialState = {
  currentUser: loadInitialState(),
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('currentUser', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('currentUser');
        }
      }
    },
    updateCurrentUser: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        // Persist updated user to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        }
      }
    },
  },
});

export const { setCurrentUser, updateCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;

