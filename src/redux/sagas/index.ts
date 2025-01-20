// src/sagas/index.ts
import { all } from "redux-saga/effects";
import { watchEditorAuthSaga } from "@/modules/Auth/saga";

// Root saga that combines all individual sagas
export default function* rootSaga() {
  yield all([watchEditorAuthSaga()]);
}
