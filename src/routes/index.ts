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
  CHILDREN: "/children",
  CHILDREN_CREATE: "/children/create",
  PROFILE: "/profile",
  APPOINTMENT_HISTORY: "/appointment/history",
  APPOINTMENT_CALENDAR: "/appointment/my-calendar",

  APPOINTMENT_BOOKING: "/appointment/booking",

  //--------TOOLS
  DUE_DATE_CALCULATOR: "/due-date-calculator",
  NAME_GENERATOR: "/name-generator",
  COST_CALCULATOR:"/cost-calculator",

  //---------GROWTH CHARTS
  MY_GROWTH_CHART: "/growth-charts/me",
  GROWTH_CHART: "/growth-charts",
  GROWTH_CHART_DETAIL: "/growth-chart/:id",


  CHILDREN_DETAIL: "/child/:id",

  //Dashboard
  DASHBOARD_MAIN: "/dashboard/main",
  DASHBOARD_DOCTOR: "/dashboard/doctor",
  DASHBOARD_EMPLOYEES: "/dashboard/employees",
  DASHBOARD_EMPLOYEE_UPDATE: "/dashboard/employee/:id",
  DASHBOARD_EMPLOYEE_CREATE: "/dashboard/employee/create",
  DASHBOARD_EMPLOYEE_DETAIL: "/dashboard/employee/detail/:id",
  DASHBOARD_EMPLOYEE_PROFILE: "/dashboard/profile",

  //Blogs
  DASHBOARD_BLOGS: "/dashboard/blogs",
  DASHBOARD_BLOG_UPDATE: "/dashboard/blog/:id",
  DASHBOARD_BLOG_CREATE: "/dashboard/blog/create",
  DASHBOARD_BLOG_DETAIL: "/dashboard/blog/detail/:id",

  //BLogTypes
  DASHBOARD_BLOGTYPES: "/dashboard/blogtypes",
  DASHBOARD_BLOGTYPE_UPDATE: "/dashboard/blogtype/:id",
  DASHBOARD_BLOGTYPE_CREATE: "/dashboard/blogtype/create",
  DASHBOARD_BLOGTYPE_DETAIL: "/dashboard/blogtype/detail/:id",



  //------CHILDREN
  DASHBOARD_CHILDREN: "/dashboard/children",
  DASHBOARD_CHILDREN_DETAIL: "/dashboard/child/:id",

  //--------USERS
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
  //-----------------APPOINTMENT
  DASHBOARD_APPOINTMENT: "/admin/appointments",
  DASHBOARD_APPOINTMENT_DETAIL: "/admin/appointment/detail/:id",
  DASHBOARD_APPOINTMENT_UPDATE: "/admin/appointment/:id",
  DASHBOARD_APPOINTMENT_CREATE: "/admin/appointment/create",

  //-----------------APPOINTMENT TEMPLATES
  DASHBOARD_APPOINTMENT_TEMPLATES: "/dashboard/appointmenttemplates",
  DASHBOARD_APPOINTMENT_TEMPLATES_UPDATE: "/dashboard/appointmenttemplates/:id",
  DASHBOARD_APPOINTMENT_TEMPLATES_CREATE:
    "/dashboard/appointmenttemplates/create",

  //----------------GROWTH CHARTS
  DASHBOARD_GROWTH_CHARTS: "/dashboard/growth-charts",
  DASHBOARD_GROWTH_CHARTS_UPDATE: "/dashboard/growth-charts/:id",
  DASHBOARD_DOCTOR_GROWTH_CHARTS: "/dashboard/doctor/growth-charts",
  DASHBOARD_DOCTOR_GROWTH_CHARTS_UPDATE: "/dashboard/doctor/growth-charts/:id",
};
