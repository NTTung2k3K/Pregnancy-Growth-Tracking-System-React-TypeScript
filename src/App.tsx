import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ROUTES } from "./routes";
import Loading from "./layouts/Loading";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./components/theme-provider";

// LAYOUTS
const MainLayout = lazy(() => import("./layouts/Main"));

// CONTAINERS
const NotFoundContainer = lazy(() => import("./containers/NotFound"));
const HomeContainer = lazy(() => import("./containers/Home"));
const ComingSoonContainer = lazy(() => import("./containers/ComingSoon"));

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFoundContainer />,
  },
  {
    path: ROUTES.HOME,
    element: <MainLayout children={<HomeContainer />} />,
  },
  {
    path: ROUTES.ABOUT,
    element: <ComingSoonContainer />,
  },
]);

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </>
  );
}

export default App;
