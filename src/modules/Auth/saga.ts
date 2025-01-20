import { takeLatest, call, put } from "redux-saga/effects";
import { UserService } from "@/services/user.service";
import { ROUTES } from "@/routes";
import { API_ROUTES } from "@/routes/api";
import toast from "react-hot-toast";
import { setUsername } from "./slice";

function* login(action: any): Generator<any, void, any> {
  const { email, password } = action.payload;

  const response = yield call(UserService.login, { email, password });

  if (response.data.statusCode === 200) {
    yield put(setUsername("huan"));
    action.navigate("/huan");
    // action.onClose();
  } else {
    toast.error(response.data.message);
  }
}
function* register(action: any): Generator<any, void, any> {
  const { email, password, date } = action.payload;

  const response = yield call(UserService.register, { email, password, date });

  if (response.data.statusCode === 200) {
    localStorage.setItem("email", email);

    window.location.href = `${ROUTES.VERIFY_OTP}`;
  } else {
    toast.error(response.data.message);
  }
}

function* confirmRegister(action: any): Generator<any, void, any> {
  const { email, code } = action.payload;

  const response = yield call(UserService.confirmRegister, { email, code });

  if (response.data.statusCode === 200) {
    window.location.href = `/auth/register-success`;
  } else {
    toast.error(response.data.message);
  }
}

export function* watchEditorAuthSaga() {
  yield takeLatest(`${API_ROUTES.LOGIN}`, login);
  yield takeLatest(`${API_ROUTES.REGISTER}`, register);
  yield takeLatest(`${API_ROUTES.CONFIRM_REGISTER}`, confirmRegister);
}
