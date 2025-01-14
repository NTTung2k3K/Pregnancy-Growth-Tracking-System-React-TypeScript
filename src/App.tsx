import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ROUTES } from "./routes";
import Loading from "./layouts/Loading";
import { Toaster } from "react-hot-toast";

// LAYOUTS
const MainLayout = lazy(() => import("./layouts/Main"));

// CONTAINERS
const NotFoundContainer = lazy(() => import("./containers/NotFound"));
const HomeContainer = lazy(() => import("./containers/Home"));

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFoundContainer />,
  },
  {
    path: ROUTES.HOME,
    element: <MainLayout children={<HomeContainer />} />,
  },
]);

function App() {
  return (
    <>
      <Toaster />
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
