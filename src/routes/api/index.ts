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

  //PROFILE
  USER_UPDATE_PROFILE: "/users/update-user-profile",


  //CHILD
  CHILD_CREATE: "/child/create",

  //Membership
  MEMBERSHIP: "/membershippackages/get-pagination",
  BUYPACKAGE: "/membershippackages/buy-package",

  //Dashboard

  //-------EMPLOYEES
  DASHBOARD_EMPLOYEES_ALL: "/employees/get-all-doctor",
  DASHBOARD_EMPLOYEE_UPDATE_PROFILE: "/employees/update-employee-profile",
  DASHBOARD_EMPLOYEE_CREATE: "/employees/create-employee",
  DASHBOARD_EMPLOYEE_DETAIL: "/employees/get-employee-by-id",
  DASHBOARD_EMPLOYEE_UPDATE_STATUS: "/employees/update-employee-status",
  DASHBOARD_EMPLOYEE_DELETE: "/employees/delete-employee",

  //-------USERS
  DASHBOARD_USERS_ALL: "/users/get-all-user",
  DASHBOARD_USER_CREATE: "/employees/create-employee",
  DASHBOARD_USER_DETAIL: "/users/get-user-by-id",
  DASHBOARD_USER_UPDATE_STATUS: "/employees/update-employee-status",
  DASHBOARD_USER_DELETE: "/employees/delete-employee",

  //--------ROLES
  DASHBOARD_ROLES_ALL: "/role/all",

  //--------STATUS
  DASHBOARD_EMPLOYEE_GET_STATUS: "/employees/get-employee-status",
  DASHBOARD_USER_GET_STATUS: "/users/get-user-status",

  //Dashboard Membership Package
  DASHBOARD_MEMBERSHIPPACKAGE_UPDATE: "/membershippackages/update",
  DASHBOARD_MEMBERSHIPPACKAGE_CREATE: "/membershippackages/create",
  DASHBOARD_MEMBERSHIPPACKAGE_DELETE: "/membershippackages/delete",
  DASHBOARD_MEMBERSHIPPACKAGE_DETAIL: "/membershippackages/get-package",
};
