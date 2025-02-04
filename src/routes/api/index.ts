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
  CHILD_BY_USER_ID: "/child/get-child-by-user-id",
  CHILD_DETAIL: "/child",
  CHILD_CREATE: "/child/create",
  CHILD_UPDATE: "/child/update",
  CHILD_DELETE: "/child/delete",

  //RECORD
  RECORD_CREATE: "/fetalgrowthrecord/create",

  //Membership
  MEMBERSHIP: "/membershippackages/get-pagination",
  BUYPACKAGE: "/membershippackages/buy-package",

  //Dashboard

  //---------CHILDREN
  DASHBOARD_CHILDREN_ALL: "/child/all",

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
  //-----------------APPOINTMENT
  DASHBOARD_APPOINTMENT_ALL: "/appointments/get-all",
  DASHBOARD_APPOINTMENT_UPDATE: "/appointments/update",
  DASHBOARD_APPOINTMENT_CREATE: "/appointments/create",
  //-----------------APPOINTMENT TEMPLATES
  DASHBOARD_APPOINTMENT_TEMPLATES_ALL: "/appointmenttemplates/get-all",
  DASHBOARD_APPOINTMENT_TEMPLATES_UPDATE: "/appointmenttemplates/update",
  DASHBOARD_APPOINTMENT_TEMPLATES_DETAIL: "/appointmenttemplates/get-by-id",
  DASHBOARD_APPOINTMENT_TEMPLATES_CREATE: "/appointmenttemplates/create",
  DASHBOARD_APPOINTMENT_TEMPLATES_DELETE: "/appointmenttemplates/delete",
};
