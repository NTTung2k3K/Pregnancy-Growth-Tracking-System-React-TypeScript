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

  //Users

  //BLOG
  BLOG_MOST_VIEW: "/blog/most-viewed",
  BLOG_MOST_LIKE: "/blog/most-liked",

  //PROFILE
  USER_UPDATE_PROFILE: "/users/update-user-profile",

  //CHILD
  CHILD_BY_USER_ID: "/child/get-child-by-user-id",
  CHILD_DETAIL: "/child",
  CHILD_CREATE: "/child/create",
  CHILD_UPDATE: "/child/update",
  CHILD_DELETE: "/child/delete",

  //USER FEEDBACK
  USER_FEEDBACK: "/feedback/get-feedback-pagination",

  //RECORD
  RECORD_CREATE: "/fetalgrowthrecord/create",

  //Membership
  MEMBERSHIP: "/membershippackages/get-pagination",
  BUYPACKAGE: "/membershippackages/buy-package",
  IS_MEMBER: "/membershippackages/can-generate-appointment",

  //-------------------------------DASHBOARD-------------------------------------------

  //---------CHILDREN
  DASHBOARD_CHILDREN_ALL: "/child/all",

  //-------EMPLOYEES
  DASHBOARD_EMPLOYEES_ALL: "/employees/get-all-doctor",
  DASHBOARD_EMPLOYEE_UPDATE_PROFILE: "/employees/update-employee-profile",
  DASHBOARD_EMPLOYEE_CREATE: "/employees/create-employee",

  //-------BLOGS
  DASHBOARD_BLOG_UPDATE: "/blog/update",
  DASHBOARD_BLOG_CREATE: "/blog/create",

  //-------BLOGTYPES
  DASHBOARD_BLOGTYPES: "/blogtype/all",
  DASHBOARD_BLOGTYPE_UPDATE: "/blogtype/update",
  DASHBOARD_BLOGTYPE_CREATE: "/blogtype/create",

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
  DASHBOARD_APPOINTMENT_ADMIN_ALL: "/appointments/get-all-by-admin",
  DASHBOARD_APPOINTMENT_DOCTOR_DETAIL: "/appointments/get-by-id",
  DASHBOARD_APPOINTMENT_ADMIN_DETAIL: "/appointments/get-by-id-side-admin",
  DASHBOARD_APPOINTMENT_DOCTOR_BY_ID: "/appointments/get-all",
  DASHBOARD_APPOINTMENT_DOCTOR_FREE: "/appointments/get-doctor-free",
  DASHBOARD_APPOINTMENT_UPDATE: "/appointments/update",
  DASHBOARD_APPOINTMENT_CREATE: "/appointments/create",
  DASHBOARD_APPOINTMENT_CHANGE_DOCTOR:
    "/appointments/change-doctor-appointment",

  //-----------------APPOINTMENT TEMPLATES
  DASHBOARD_APPOINTMENT_TEMPLATES_ALL: "/appointmenttemplates/get-all",
  DASHBOARD_APPOINTMENT_TEMPLATES_UPDATE: "/appointmenttemplates/update",
  DASHBOARD_APPOINTMENT_TEMPLATES_DETAIL: "/appointmenttemplates/get-by-id",
  DASHBOARD_APPOINTMENT_TEMPLATES_CREATE: "/appointmenttemplates/create",
  DASHBOARD_APPOINTMENT_TEMPLATES_DELETE: "/appointmenttemplates/delete",

  //---------------------GROWTH CHARTS
  DASHBOARD_GROWTH_CHARTS_ALL: "/growthchart/get-all-growth-chart-by-admin",
  DASHBOARD_GROWTH_CHARTS_STATUS_ALL: "/growthchart/get-status-handler",
  DASHBOARD_GROWTH_CHARTS_UPDATE: "/growthchart/update-growth-chart-by-admin",
  DASHBOARD_GROWTH_CHARTS_DETAIL: "/growthchart/get-by-id",
  DASHBOARD_GROWTH_CHARTS_DELETE: "/growthchart/delete",

  //----------------------FEEDBACK
  DASHBOARD_FEEDBACKS_ALL: "/feedback/get-feedback-pagination-admin",
  DASHBOARD_FEEDBACKS_BAN: "/feedback/ban-feedback",
  DASHBOARD_FEEDBACKS_DELETE: "/feedback/delete",

  //-------------------DOCTOR CALENDAR
  DOCTOR_CALENDAR: "/appointments/get-doctor-in-range-by-user-id",

  //--------------------MAIN ADMIN
  NEW_DATA_USER: "/users/get-new-user-statistic",
  MONTHLY_BLOG: "/blog/count-by-month",
  MONTHLY_PAYMENTS: "/payments/get-monthly-payment-statistics",
  GET_REVENUE: "/payments/get-total-revenue-for-current-year",
  GET_RECENT_TRANSACTION: "/payments/get-recent-transactions",

  //-------------GROWTH STANDARD
  DASHBOARD_GROWTH_STANDARD_ALL: "/fetalgrowthstandard/all",
  DASHBOARD_GROWTH_STANDARD_DETAIL: "/fetalgrowthstandard",
  DASHBOARD_GROWTH_STANDARD_UPDATE: "/fetalgrowthstandard/update",
  DASHBOARD_GROWTH_STANDARD_CREATE: "/fetalgrowthstandard/create",
  DASHBOARD_GROWTH_STANDARD_DELETE: "/fetalgrowthstandard/delete",

  //-------------DOCTOR EDIT APPOINTMENT STANDARD BY WEEK
  DASHBOARD_DOCTOR_APPOINTMENT_STANDARD_WEEK: "/fetalgrowthstandard/get-by-week",
};
