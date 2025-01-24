import { takeLatest, call } from "redux-saga/effects";
import { UserService } from "@/services/user.service";
import { ROUTES } from "@/routes";
import { API_ROUTES } from "@/routes/api";
import toast from "react-hot-toast";
import {
  CookiesEmployeeService,
  CookiesService,
} from "@/services/cookies.service";
import { EmployeeService } from "@/services/employee.service";

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
function* loginWithGoogle(action: any): Generator<any, void, any> {
  const { token, email, email_verified, family_name, given_name, name, picture, sub } = action.payload;

  // Gọi API backend để đăng nhập bằng Google, truyền token và các thông tin người dùng
  const response = yield call(UserService.loginWithGoogle, { 
    token, email, email_verified, family_name, given_name, name, picture, sub
  });

  if (response.data.statusCode === 200) {
    CookiesService.set(response.data.resultObj.id);
    console.log(response.data.resultObj.id);
    window.location.href = `/`;
    action.onClose();
  } else {
    toast.error(response.data.message);
    console.log("thang")
  }
}

function* employeeLogin(action: any): Generator<any, void, any> {
  const { userName, password } = action.payload;

  const response = yield call(EmployeeService.login, {
    userName,
    password,
  });

  if (response.data.statusCode === 200) {
    CookiesEmployeeService.set(response.data.resultObj.id);
    window.location.href = `/dashboard`;
  } else {
    toast.error(response.data.message);
  }
}

function* register(action: any): Generator<any, void, any> {
  const { email, password } = action.payload;

  const response = yield call(UserService.register, {
    email,
    password,
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
function* employeeForgotPassword(action: any): Generator<any, void, any> {
  const { email } = action.payload;
  console.log(email);
  const response = yield call(EmployeeService.forgotPassword, { email });
  if (response.data.statusCode === 200) {
    toast.success(response.data.message);
  } else {
    toast.error(response.data.message);
  }
}
function* resetPassword(action: any): Generator<any, void, any> {
  const { email, password, confirmPassword, token } = action.payload;
  console.log(email, password, confirmPassword, token);
  const response = yield call(UserService.resetPassword, {
    email,
    password,
    confirmPassword,
    token,
  });
  if (response.data.statusCode === 200) {
    action.navigate(`/`);
    toast.success(response.data.message);
  } else {
    toast.error(response.data.message);
  }
}
function* employeeResetPassword(action: any): Generator<any, void, any> {
  const { email, password, confirmPassword, token } = action.payload;
  console.log(email, password, confirmPassword, token);
  const response = yield call(EmployeeService.resetPassword, {
    email,
    password,
    confirmPassword,
    token,
  });
  if (response.data.statusCode === 200) {
    localStorage.setItem("action", "");
    action.navigate(`${ROUTES.EMPLOYEE_LOGIN}`);
    toast.success(response.data.message);
  } else {
    toast.error(response.data.message);
  }
}

export function* watchEditorAuthSaga() {
  yield takeLatest(`${API_ROUTES.LOGIN}`, login);
  yield takeLatest(`${API_ROUTES.LOGIN_WITH_GOOGLE}`, loginWithGoogle);
  yield takeLatest(`${API_ROUTES.EMPLOYEE_LOGIN}`, employeeLogin);
  yield takeLatest(`${API_ROUTES.REGISTER}`, register);
  yield takeLatest(`${API_ROUTES.CONFIRM_REGISTER}`, confirmRegister);
  yield takeLatest(`${API_ROUTES.FORGOT_PASSWORD}`, forgotPassword);
  yield takeLatest(
    `${API_ROUTES.EMPLOYEE_FORGOT_PASSWORD}`,
    employeeForgotPassword
  );
  yield takeLatest(`${API_ROUTES.RESET_PASSWORD}`, resetPassword);
  yield takeLatest(
    `${API_ROUTES.EMPLOYEE_RESET_PASSWORD}`,
    employeeResetPassword
  );
}
