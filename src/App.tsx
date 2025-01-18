import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ROUTES } from "./routes";
import Loading from "./layouts/Loading";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./components/theme-provider";
import ScrollToTop from "./components/ScrollToTop";

// LAYOUTS
const MainLayout = lazy(() => import("./layouts/Main"));

// CONTAINERS
//------------MAIN PAGES----------------
const NotFoundContainer = lazy(() => import("./containers/NotFound"));
const HomeContainer = lazy(() => import("./containers/Home"));
const ComingSoonContainer = lazy(() => import("./containers/ComingSoon"));
const BlogDetailContainer = lazy(() => import("./containers/BlogDetail"));

//------------Auth PAGES----------------
const ResetPasswordContainer = lazy(() => import("./containers/ResetPassword"));
const VerifyOTPContainer = lazy(() => import("./containers/VerifyOTP"));
const NewPasswordContainer = lazy(() => import("./containers/NewPassword"));

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
    path: ROUTES.BLOG_DETAIL,
    element: <MainLayout children={<BlogDetailContainer />} />,
  },
]);

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Suspense fallback={<Loading />}>
          <ScrollToTop router={router} />
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </>
  );
}

export default App;
