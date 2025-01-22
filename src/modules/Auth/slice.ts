// store/slices/editorSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./state";

const editorSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    clearEmail: (state) => {
      state.email = null;
    },
  },
});

export const { setEmail, clearEmail } =
  editorSlice.actions;
export default editorSlice.reducer;
