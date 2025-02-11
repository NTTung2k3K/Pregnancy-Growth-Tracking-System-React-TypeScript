import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ROUTES } from "./routes";
import Loading from "./layouts/Loading";
import { Toaster } from "react-hot-toast";
// import { ThemeProvider } from "./components/theme-provider";
import ScrollToTop from "./components/ScrollToTop";
import GrowthChart from "@/containers/Growth-Chart";
import GrowthChartDetail from "@/containers/Growth-Chart/Detail";
import GrowthChartMe from "@/containers/Growth-Chart/Me";
import AppointmentCalendarContainer from "@/containers/AppointmentCalendar";

// LAYOUTS
const MainLayout = lazy(() => import("./layouts/Main"));
const DashboardLayout = lazy(() => import("./layouts/Dashboard"));

// CONTAINERS
//------------MAIN PAGES----------------
const NotFoundContainer = lazy(() => import("./containers/NotFound"));
const HomeContainer = lazy(() => import("./containers/Home"));
const ComingSoonContainer = lazy(() => import("./containers/ComingSoon"));
const BlogContainer = lazy(() => import("./containers/Blog"))
const BlogByWeekContainer = lazy(() => import("./containers/BlogWeek"))
const BlogByBlogTypeContainer = lazy(() => import("./containers/Blog/getblogbyblogtype"))
const BlogDetailContainer = lazy(() => import("./containers/BlogDetail"));
const AppoinmentContainer = lazy(() => import("./containers/Appointment"));
const AppoinmentHistoryContainer = lazy(
  () => import("./containers/Appointment-History")
);
const AppoinmentBookingContainer = lazy(
  () => import("./containers/Appointment-Booking")
);
const MembershipContainer = lazy(() => import("./containers/Membership"));
const PaymentPage = lazy(() => import("./containers//Membership/payment"));
const PaymentResultPage = lazy(
  () => import("./containers/Membership/payment-result")
);
const ChildrenGridContainer = lazy(() => import("./containers/Children"));
const ChildCreateContainer = lazy(() => import("./containers/Children/Create"));
const UserProfileContainer = lazy(() => import("./containers/Profile"));
const ChildDetailContainer = lazy(() => import("./containers/Children/Detail"));

// ----------------------TOOLS
const DueDateCalculatorContainer = lazy(
  () => import("./containers/Tools/DueDateCalculator")
);
const NameGeneratorContainer = lazy(
  () => import("./containers/Tools/NameGenerator")
);
const CostCalculatorContainer = lazy(
  () => import("./containers/Tools/CostCalculator")
);

//------------Auth PAGES----------------
const ResetPasswordContainer = lazy(() => import("./containers/ResetPassword"));
const VerifyOTPContainer = lazy(() => import("./containers/VerifyOTP"));
const NewPasswordContainer = lazy(() => import("./containers/NewPassword"));
const EmployeeLoginContainer = lazy(() => import("./containers/EmployeeLogin"));

//------------DASHBOARD PAGES----------------
const DashboardMainContainer = lazy(
  () => import("./containers/Dashboard/Main")
);
//-----------DASHBOARD PAYMENT ADMIN
const PaymentContainer = lazy(() => import("@/containers/Dashboard/Payment"));
const PaymentDetailContainer = lazy(
  () => import("@/containers/Dashboard/Payment/Detail")
);
//-----------DASHBOARD APPOINTMENT DOCTOR

const AppointmentCreateContainer = lazy(
  () => import("@/containers/Dashboard/Appointment/Create")
);
const AppointmentUpdateContainer = lazy(
  () => import("@/containers/Dashboard/Appointment/Update")
);
const AppointmentDetailContainer = lazy(
  () => import("@/containers/Dashboard/Appointment/Detail")
);
const AppointmentAdminContainer = lazy(
  () => import("@/containers/Dashboard/Appointment")
);
//-----------DASHBOARD APPOINTMENT TEMPLATES

const AppointmentTemplatesDashboardContainer = lazy(
  () => import("./containers/Dashboard/AppoinmentTemplates")
);
const AppointmentTemplatesCreateContainer = lazy(
  () => import("./containers/Dashboard/AppoinmentTemplates/Create")
);
const AppointmentTemplatesUpdateContainer = lazy(
  () => import("./containers/Dashboard/AppoinmentTemplates/Update")
);

//------------------------------EMPLOYEES
const DoctorContainer = lazy(() => import("./containers/Dashboard/Doctor"));
const EmployeesContainer = lazy(
  () => import("./containers/Dashboard/Employees")
);
const EmployeeCreateContainer = lazy(
  () => import("./containers/Dashboard/Employees/Create")
);
const EmployeeUpdateContainer = lazy(
  () => import("./containers/Dashboard/Employees/Update")
);
const EmployeeDetailContainer = lazy(
  () => import("./containers/Dashboard/Employees/Detail")
);
const BlogsContainer = lazy(() => import("./containers/Dashboard/Blogs"));
const BlogCreateContainer = lazy(
  () => import("./containers/Dashboard/Blogs/Create")
);
const BlogUpdateContainer = lazy(
  () => import("./containers/Dashboard/Blogs/Update")
);
const BlogsDetailContainer = lazy(
  () => import("./containers/Dashboard/Blogs/Detail")
);
const BlogTypesContainer = lazy(
  () => import("./containers/Dashboard/BlogTypes")
);
const BlogTypeCreateContainer = lazy(
  () => import("./containers/Dashboard/BlogTypes/Create")
);
const BlogTypeUpdateContainer = lazy(
  () => import("./containers/Dashboard/BlogTypes/Update")
);
const BlogTypeDetailContainer = lazy(
  () => import("./containers/Dashboard/BlogTypes/Detail")
);
const EmployeeProfileContainer = lazy(
  () => import("./containers/Dashboard/Profile")
);

//------------------------------CHILDREN
const ChildrenDashboardContainer = lazy(
  () => import("./containers/Dashboard/Children")
);
const ChildDashboardDetailContainer = lazy(
  () => import("./containers/Dashboard/Children/Detail")
);

//------------MEMBERSHIP-PACKAGE PAGES----------------

const MembershipPackagesDashboardContainer = lazy(
  () => import("./containers/Dashboard/MembershipPackage")
);
const MembershipPackageDashboardCreateContainer = lazy(
  () => import("./containers/Dashboard/MembershipPackage/Create")
);

const MembershipPackageDashboardUpdateContainer = lazy(
  () => import("./containers/Dashboard/MembershipPackage/Update")
);

const MembershipPackageDashboardDetailContainer = lazy(
  () => import("./containers/Dashboard/MembershipPackage/Detail")
);

//-------------------GROWTH CHARTS

const GrowthChartsContainer = lazy(
  () => import("./containers/Dashboard/GrowthCharts")
);

const GrowthChartUpdateContainer = lazy(
  () => import("./containers/Dashboard/GrowthCharts/Update")
);

//------------------------------USERS
const UsersContainer = lazy(() => import("./containers/Dashboard/Users"));
const UserDetailContainer = lazy(
  () => import("./containers/Dashboard/Users/Detail")
);
const UserUpdateContainer = lazy(
  () => import("./containers/Dashboard/Users/Update")
);

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFoundContainer />,
  },

  //------------Auth PAGES----------------
  {
    path: ROUTES.RESET_PASSWORD,
    element: <MainLayout children={<ResetPasswordContainer />} />,
  },
  {
    path: ROUTES.VERIFY_OTP,
    element: <MainLayout children={<VerifyOTPContainer />} />,
  },
  {
    path: ROUTES.NEW_PASSWORD,
    element: <MainLayout children={<NewPasswordContainer />} />,
  },
  {
    path: ROUTES.EMPLOYEE_LOGIN,
    element: <EmployeeLoginContainer />,
  },

  // ------------MAIN PAGES----------------
  {
    path: ROUTES.HOME,
    element: <MainLayout children={<HomeContainer />} />,
  },
  {
    path: ROUTES.ABOUT,
    element: <ComingSoonContainer />,
  },
  {
    path: ROUTES.BLOG,
    element: <MainLayout children={<BlogContainer />} />,
  },
  {
    path: ROUTES.BLOGTYPE,
    element: <MainLayout children={<BlogByBlogTypeContainer />} />,
  },{
    path: ROUTES.BLOGWEEK,
    element: <MainLayout children={<BlogByWeekContainer />} />
  },
  {
    path: ROUTES.BLOG_DETAIL,
    element: <MainLayout children={<BlogDetailContainer />} />,
  },
  {
    path: ROUTES.APPOINTMENT,
    element: <MainLayout children={<AppoinmentContainer />} />,
  },
  {
    path: ROUTES.APPOINTMENT_HISTORY,
    element: <MainLayout children={<AppoinmentHistoryContainer />} />,
  },
  {
    path: ROUTES.APPOINTMENT_CALENDAR,
    element: <MainLayout children={<AppointmentCalendarContainer />} />,
  },
  {
    path: ROUTES.APPOINTMENT_BOOKING,
    element: <MainLayout children={<AppoinmentBookingContainer />} />,
  },
  {
    path: ROUTES.MEMBERSHIP,
    element: <MainLayout children={<MembershipContainer />} />,
  },
  {
    path: ROUTES.PAYMENT,
    element: <MainLayout children={<PaymentPage />} />,
  },
  {
    path: ROUTES.PAYMENT_RESULT,
    element: <MainLayout children={<PaymentResultPage />} />,
  },
  {
    path: ROUTES.CHILDREN,
    element: <MainLayout children={<ChildrenGridContainer />} />,
  },
  {
    path: ROUTES.CHILDREN_CREATE,
    element: <MainLayout children={<ChildCreateContainer />} />,
  },
  {
    path: ROUTES.PROFILE,
    element: <MainLayout children={<UserProfileContainer />} />,
  },
  {
    path: ROUTES.CHILDREN_DETAIL,
    element: <MainLayout children={<ChildDetailContainer />} />,
  },

  //-------- TOOLS

  {
    path: ROUTES.DUE_DATE_CALCULATOR,
    element: <MainLayout children={<DueDateCalculatorContainer />} />,
  },
  {
    path: ROUTES.NAME_GENERATOR,
    element: <MainLayout children={<NameGeneratorContainer />} />,
  },
  {
    path: ROUTES.COST_CALCULATOR,
    element: <MainLayout children={<CostCalculatorContainer />} />,
  },

  //---------- Growthchart
  {
    path: ROUTES.GROWTH_CHART,
    element: <MainLayout children={<GrowthChart />} />,
  },
  {
    path: ROUTES.GROWTH_CHART_DETAIL,
    element: <MainLayout children={<GrowthChartDetail />} />,
  },
  {
    path: ROUTES.MY_GROWTH_CHART,
    element: <MainLayout children={<GrowthChartMe />} />,
  },
  //---------- DASHBOARD PAGES-------------
  {
    path: ROUTES.DASHBOARD_MAIN,
    element: <DashboardLayout children={<DashboardMainContainer />} />,
  },

  //-----------------------EMPLOYEES
  {
    path: ROUTES.DASHBOARD_DOCTOR,
    element: <DashboardLayout children={<DoctorContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_EMPLOYEES,
    element: <DashboardLayout children={<EmployeesContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_EMPLOYEE_CREATE,
    element: <DashboardLayout children={<EmployeeCreateContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_EMPLOYEE_UPDATE,
    element: <DashboardLayout children={<EmployeeUpdateContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_EMPLOYEE_DETAIL,
    element: <DashboardLayout children={<EmployeeDetailContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_BLOGS,
    element: <DashboardLayout children={<BlogsContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_BLOG_CREATE,
    element: <DashboardLayout children={<BlogCreateContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_BLOG_UPDATE,
    element: <DashboardLayout children={<BlogUpdateContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_BLOG_DETAIL,
    element: <DashboardLayout children={<BlogsDetailContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_BLOGTYPES,
    element: <DashboardLayout children={<BlogTypesContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_BLOGTYPE_CREATE,
    element: <DashboardLayout children={<BlogTypeCreateContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_BLOGTYPE_UPDATE,
    element: <DashboardLayout children={<BlogTypeUpdateContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_BLOGTYPE_DETAIL,
    element: <DashboardLayout children={<BlogTypeDetailContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_EMPLOYEE_PROFILE,
    element: <DashboardLayout children={<EmployeeProfileContainer />} />,
  },
  //-----------------------USERS

  {
    path: ROUTES.DASHBOARD_USERS,
    element: <DashboardLayout children={<UsersContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_USER_DETAIL,
    element: <DashboardLayout children={<UserDetailContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_USER_UPDATE,
    element: <DashboardLayout children={<UserUpdateContainer />} />,
  },

  //-----------------------CHILDREN

  {
    path: ROUTES.DASHBOARD_CHILDREN,
    element: <DashboardLayout children={<ChildrenDashboardContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_CHILDREN_DETAIL,
    element: <DashboardLayout children={<ChildDashboardDetailContainer />} />,
  },

  //---------- MEMBERSHIP-PACKAGE PAGES-------------

  {
    path: ROUTES.DASHBOARD_MEMBERSHIPPACKAGE,
    element: (
      <DashboardLayout children={<MembershipPackagesDashboardContainer />} />
    ),
  },
  {
    path: ROUTES.DASHBOARD_MEMBERSHIPPACKAGE_CREATE,
    element: (
      <DashboardLayout
        children={<MembershipPackageDashboardCreateContainer />}
      />
    ),
  },
  {
    path: ROUTES.DASHBOARD_MEMBERSHIPPACKAGE_UPDATE,
    element: (
      <DashboardLayout
        children={<MembershipPackageDashboardUpdateContainer />}
      />
    ),
  },
  {
    path: ROUTES.DASHBOARD_MEMBERSHIPPACKAGE_DETAIL,
    element: (
      <DashboardLayout
        children={<MembershipPackageDashboardDetailContainer />}
      />
    ),
  },
  //-----------------------Admin PAYMENTS----------------
  {
    path: ROUTES.DASHBOARD_PAYMENT,
    element: <DashboardLayout children={<PaymentContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_PAYMENT_DETAIL,
    element: <DashboardLayout children={<PaymentDetailContainer />} />,
  },
  //-----------------------Admin APPOINTMENTS----------------
  {
    path: ROUTES.DASHBOARD_APPOINTMENT,
    element: <DashboardLayout children={<AppointmentAdminContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_APPOINTMENT_CREATE,
    element: <DashboardLayout children={<AppointmentCreateContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_APPOINTMENT_UPDATE,
    element: <DashboardLayout children={<AppointmentUpdateContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_APPOINTMENT_DETAIL,
    element: <DashboardLayout children={<AppointmentDetailContainer />} />,
  },
  //-----------------------Admin APPOINTMENTS TEMPLATES----------------
  {
    path: ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES,
    element: (
      <DashboardLayout children={<AppointmentTemplatesDashboardContainer />} />
    ),
  },
  {
    path: ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES_CREATE,
    element: (
      <DashboardLayout children={<AppointmentTemplatesCreateContainer />} />
    ),
  },
  {
    path: ROUTES.DASHBOARD_APPOINTMENT_TEMPLATES_UPDATE,
    element: (
      <DashboardLayout children={<AppointmentTemplatesUpdateContainer />} />
    ),
  },

  //--------------GROWTH CHARTS

  {
    path: ROUTES.DASHBOARD_GROWTH_CHARTS,
    element: <DashboardLayout children={<GrowthChartsContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_GROWTH_CHARTS_UPDATE,
    element: <DashboardLayout children={<GrowthChartUpdateContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_DOCTOR_GROWTH_CHARTS,
    element: <DashboardLayout children={<GrowthChartsContainer />} />,
  },
  {
    path: ROUTES.DASHBOARD_DOCTOR_GROWTH_CHARTS_UPDATE,
    element: <DashboardLayout children={<GrowthChartUpdateContainer />} />,
  },
]);

function App() {
  return (
    <>
      <Toaster />
      <Suspense fallback={<Loading />}>
        <ScrollToTop router={router} />
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
