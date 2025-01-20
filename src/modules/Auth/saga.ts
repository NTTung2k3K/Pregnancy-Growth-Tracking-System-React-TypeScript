import { takeLatest, call } from "redux-saga/effects";
import { UserService } from "@/services/user.service";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";

function* register(action: any): Generator<any, void, any> {
  const { email, password, date } = action.payload;

  const response = yield call(UserService.register, { email, password, date });

  if (response.data.statusCode === 200) {
    window.location.href = `${ROUTES.VERIFY_OTP}`;
  } else {
    toast.error(response.data.message);
  }
}

export function* watchEditorAuthSaga() {
  yield takeLatest(`register`, register);
}
