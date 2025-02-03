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
  DASHBOARD_MAIN:"/dashboard/main",
  DASHBOARD_EMPLOYEES:"/dashboard/employees",
  DASHBOARD_EMPLOYEE_UPDATE:"/dashboard/employee/:id",
  DASHBOARD_EMPLOYEE_CREATE:"/dashboard/employee/create",
  DASHBOARD_EMPLOYEE_DETAIL:"/dashboard/employee/detail/:id",

  DASHBOARD_BLOGS:"/dashboard/blogs",
  DASHBOARD_BLOG_UPDATE:"/dashboard/blog/:id",
  DASHBOARD_BLOG_CREATE:"/dashboard/blog/create",
  DASHBOARD_BLOG_DETAIL:"/dashboard/blog/detail/:id",

  DASHBOARD_BLOGTYPES:"/dashboard/blogtypes",
  DASHBOARD_BLOGTYPE_UPDATE:"/dashboard/blogtype/:id",
  DASHBOARD_BLOGTYPE_CREATE:"/dashboard/blogtype/create",
  DASHBOARD_BLOGTYPE_DETAIL:"/dashboard/blogtype/detail/:id",
};
