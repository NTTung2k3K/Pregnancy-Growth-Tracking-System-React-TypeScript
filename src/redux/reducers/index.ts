// src/reducers/index.ts
import { combineReducers } from "redux";
import authReducer from "@/modules/Auth/slice";

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
