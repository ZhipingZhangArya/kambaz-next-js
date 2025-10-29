import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../Database";
import { v4 as uuidv4 } from "uuid";

// Load initial state from localStorage
const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const storedEnrollments = localStorage.getItem('enrollments');
    if (storedEnrollments) {
      try {
        return JSON.parse(storedEnrollments);
      } catch {
        return enrollments;
      }
    }
  }
  return enrollments;
};

const initialState = {
  enrollments: loadInitialState(),
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    addEnrollment: (state, { payload: enrollment }) => {
      const newEnrollment: any = {
        _id: uuidv4(),
        ...enrollment,
      };
      state.enrollments = [...state.enrollments, newEnrollment] as any;
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('enrollments', JSON.stringify(state.enrollments));
      }
    },
    deleteEnrollment: (state, { payload: enrollmentId }) => {
      state.enrollments = state.enrollments.filter(
        (e: any) => e._id !== enrollmentId
      );
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('enrollments', JSON.stringify(state.enrollments));
      }
    },
  },
});

export const { addEnrollment, deleteEnrollment } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;

