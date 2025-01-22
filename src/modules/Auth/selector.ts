import { RootState } from "@/redux/store";

export const selectAuthStateEmail = (state: RootState) => state.auth.email;