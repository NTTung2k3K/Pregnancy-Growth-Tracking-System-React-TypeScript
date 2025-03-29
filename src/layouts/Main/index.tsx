import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Topbar from "../../components/Topbar";
import { useEffect } from "react";

interface MainLayoutProps {
  children?: React.ReactNode;
}
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    voiceflow?: any; // Khai báo voiceflow trên window
  }
}
const MainLayout = ({ children }: MainLayoutProps) => {
  useEffect(() => {
    // Kiểm tra nếu script đã tồn tại để tránh load nhiều lần

    if (!document.getElementById("voiceflow-chatbot")) {
      const script = document.createElement("script");
      script.id = "voiceflow-chatbot";
      script.type = "text/javascript";
      script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
      script.onload = () => {
        window.voiceflow?.chat.load({
          verify: { projectID: "67e6465b60fe7e4d365e062a" },
          url: "https://general-runtime.voiceflow.com",
          versionID: "production",
          voice: {
            url: "https://runtime-api.voiceflow.com",
          },
        });
      };
      setTimeout(() => {
        const chatInput = document.querySelector(".vfrc-chat-input");
        if (chatInput) {
          console.log(chatInput);

          (chatInput as HTMLElement).style.backgroundColor = "white";
        }
      }, 3000);
      document.body.appendChild(script);
    }
  }, []);
  return (
    <div className="flex flex-col">
      <Topbar />
      <Navbar />
      {children}
      {/* <ChatbotToggle /> */}
      <Footer />
    </div>
  );
};

export default MainLayout;
