import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ROUTES } from "./routes";
import Loading from "./layouts/Loading";
import { Toaster } from "react-hot-toast";
// import { ThemeProvider } from "./components/theme-provider";
import ScrollToTop from "./components/ScrollToTop";
import PaymentContainer from "@/containers/Dashboard/Payment";
import PaymentDetailContainer from "@/containers/Dashboard/Payment/Detail";
// LAYOUTS
const MainLayout = lazy(() => import("./layouts/Main"));
const DashboardLayout = lazy(() => import("./layouts/Dashboard"));

// CONTAINERS
//------------MAIN PAGES----------------
const NotFoundContainer = lazy(() => import("./containers/NotFound"));
const HomeContainer = lazy(() => import("./containers/Home"));
const ComingSoonContainer = lazy(() => import("./containers/ComingSoon"));
const BlogGridContainer = lazy(() => import("./containers/BlogGrid"));
const BlogDetailContainer = lazy(() => import("./containers/BlogDetail"));
const AppoinmentContainer = lazy(() => import("./containers/Appointment"));
const MembershipContainer = lazy(() => import("./containers/Membership"));
const PaymentPage = lazy(() => import("./containers//Membership/payment"));
const PaymentResultPage = lazy(
  () => import("./containers/Membership/payment-result")
);
const ChildrenGridContainer = lazy(() => import("./containers/Children"));
const ChildCreateContainer = lazy(() => import("./containers/Children/Create"));
const UserProfileContainer = lazy(() => import("./containers/Profile"));

//------------Auth PAGES----------------
const ResetPasswordContainer = lazy(() => import("./containers/ResetPassword"));
const VerifyOTPContainer = lazy(() => import("./containers/VerifyOTP"));
const NewPasswordContainer = lazy(() => import("./containers/NewPassword"));
const EmployeeLoginContainer = lazy(() => import("./containers/EmployeeLogin"));

//------------DASHBOARD PAGES----------------
const DashboardMainContainer = lazy(
  () => import("./containers/Dashboard/Main")
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
const EmployeeProfileContainer = lazy(
  () => import("./containers/Dashboard/Profile")
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
    element: <MainLayout children={<BlogGridContainer />} />,
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
