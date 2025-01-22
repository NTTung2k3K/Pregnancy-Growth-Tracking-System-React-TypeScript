import { takeLatest, call, put } from "redux-saga/effects";
import { UserService } from "@/services/user.service";
import { ROUTES } from "@/routes";
import { API_ROUTES } from "@/routes/api";
import toast from "react-hot-toast";
import { CookiesService } from "@/services/cookies.service";

function* login(action: any): Generator<any, void, any> {
  const { email, password } = action.payload;

  const response = yield call(UserService.login, { email, password });

  if (response.data.statusCode === 200) {
    CookiesService.set(response.data.resultObj.id);
    window.location.href = `/`;
    action.onClose();
  } else {
    toast.error(response.data.message);
  }
}

function* register(action: any): Generator<any, void, any> {
  const { email, password, dueDate } = action.payload;

  const response = yield call(UserService.register, {
    email,
    password,
    dueDate,
  });

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
    CookiesService.set(response.data.resultObj.id);
    action.navigate("/");
  } else {
    toast.error(response.data.message);
  }
}
function* forgotPassword(action: any): Generator<any, void, any> {
  const { email } = action.payload;
  console.log(email);
  const response = yield call(UserService.forgotPassword, { email });
  if (response.data.statusCode === 200) {
    toast.success(response.data.message);
  } else {
    toast.error(response.data.message);
  }
}
function* resetPassword(action: any): Generator<any, void, any> {
  const { email, password, confirmPassword, token } = action.payload;
  console.log(email, password, confirmPassword, token)
  const response = yield call(UserService.resetPassword, {
    email,
    password,
    confirmPassword,
    token,
  });
  console.log(response.data)
  // if (response.data.statusCode === 200) {
  //   action.navigate(`/`);
  //   toast.success(response.data.message);
  // } else {
  //   toast.error(response.data.message);
  // }
}

export function* watchEditorAuthSaga() {
  yield takeLatest(`${API_ROUTES.LOGIN}`, login);
  yield takeLatest(`${API_ROUTES.REGISTER}`, register);
  yield takeLatest(`${API_ROUTES.CONFIRM_REGISTER}`, confirmRegister);
  yield takeLatest(`${API_ROUTES.FORGOT_PASSWORD}`, forgotPassword);
  yield takeLatest(`${API_ROUTES.RESET_PASSWORD}`, resetPassword);
}
