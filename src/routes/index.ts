export const ROUTES = {
  // Auth
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_OTP: "/auth/verify-otp",
  NEW_PASSWORD: "/auth/new-password",
  EMPLOYEE_LOGIN: "/auth/employee-login",

  // Main
  HOME: "/",
  ABOUT: "/about",
  BLOG: "/blog/:type",
  BLOG_DETAIL: "/blog-detail/:id",
  APPOINTMENT: "/appointment",
  MEMBERSHIP: "/membership",
  PAYMENT: "/payment/:pkgId",
  PAYMENT_RESULT: "/membershippackages/payment-result",

  //Dashboard
  DASHBOARD_MAIN: "/dashboard/main",

  //--------EMPLOYEES
  DASHBOARD_EMPLOYEES: "/dashboard/employees",
  DASHBOARD_EMPLOYEE_UPDATE: "/dashboard/employee/:id",
  DASHBOARD_EMPLOYEE_CREATE: "/dashboard/employee/create",
  DASHBOARD_EMPLOYEE_DETAIL: "/dashboard/employee/detail/:id",

  //--------USERs
  DASHBOARD_USERS: "/dashboard/users",
  DASHBOARD_USER_UPDATE: "/dashboard/user/:id",
  DASHBOARD_USER_DETAIL: "/dashboard/user/detail/:id",

  //-----------MEMBERSHIPPACKAGE
  DASHBOARD_MEMBERSHIPPACKAGE: "/dashboard/membership-packages",
  DASHBOARD_MEMBERSHIPPACKAGE_UPDATE: "/dashboard/membership-package/:id",
  DASHBOARD_MEMBERSHIPPACKAGE_CREATE: "/dashboard/membership-package/create",
  DASHBOARD_MEMBERSHIPPACKAGE_DETAIL:
    "/dashboard/membership-package/detail/:id",

  //-----------PAYMENT
  DASHBOARD_PAYMENT: "/dashboard/payments",
  DASHBOARD_PAYMENT_DETAIL: "/dashboard/payment/detail/:id",
};
