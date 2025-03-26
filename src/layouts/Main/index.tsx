import ChatbotToggle from "@/components/ChatbotSystem/ChatbotToggle";
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
      <ChatbotToggle />
      <Footer />
    </div>
  );
};

export default MainLayout;
