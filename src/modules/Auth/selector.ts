import { RootState } from "@/redux/store";

export const selectAuthStateUsername = (state: RootState) => state.auth.username;