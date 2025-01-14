import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Topbar from "../../components/Topbar";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col">
      <Topbar />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
