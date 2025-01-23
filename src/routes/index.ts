export const ROUTES = {
  // Auth
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_OTP: "/auth/verify-otp",
  NEW_PASSWORD: "/auth/new-password",
  EMPLOYEE_LOGIN: "/auth/employee-login",

  // Main
  HOME: "/",
  ABOUT:"/about",
  BLOG:"/blog/:type",
  BLOG_DETAIL:"/blog-detail/:id",
  APPOINTMENT:"/appointment",
  MEMBERSHIP:"/membership",
  PAYMENT: "/payment/:pkgId",
  PAYMENT_RESULT: "/membershippackages/payment-result",

  //Dashboard
  DASHBOARD_EMPLOYEES:"/dashboard/employees",
  DASHBOARD_EMPLOYEE_UPDATE:"/dashboard/employee/:id",
};
