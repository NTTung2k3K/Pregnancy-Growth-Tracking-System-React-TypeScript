export const API_ROUTES = {
  // Auth
  LOGIN: "/auth/user-login",
  LOGIN_WITH_GOOGLE: "/auth/user-login-google",
  EMPLOYEE_LOGIN: "/auth/employee-login",
  REGISTER: "/auth/user-register",
  CONFIRM_REGISTER: "/auth/confirm-user-register",
  FORGOT_PASSWORD: "/auth/user-forgot-password",
  RESET_PASSWORD: "/auth/user-reset-password",
  EMPLOYEE_FORGOT_PASSWORD: "/auth/employee-forgot-password",
  EMPLOYEE_RESET_PASSWORD: "/auth/employee-reset-password",

  //Membership
  MEMBERSHIP: "/membershippackages/get-pagination",
  BUYPACKAGE: "/membershippackages/buy-package",
  
  //Dashboard
  DASHBOARD_EMPLOYEE_UPDATE: "/employees/update-employee-profile",
};
