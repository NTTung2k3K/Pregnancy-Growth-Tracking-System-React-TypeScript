import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import ChatBot from "react-simple-chatbot";
// @ts-ignore
import { ThemeProvider } from "styled-components";
import axios from "axios";
import { BASE_URL } from "@/services/config";

const APIResponse = ({ steps, triggerNextStep }: any) => {
  const userMessage = steps["2"]?.value;
  const [response, setResponse] = useState<string | null>(null);
  const hasFetched = useRef(false); 

  useEffect(() => {
    if (!userMessage || hasFetched.current) return; 
    hasFetched.current = true; 

    const fetchResponse = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/ai-web/get-website-response`,
          {
            params: { question: userMessage },
          }
        );

        setResponse(data.message || "Không có phản hồi.");

        if (triggerNextStep) {
          triggerNextStep({ value: data.message || "Không có phản hồi." });
        } else {
          console.warn("TriggerNextStep is undefined!");
        }
      } catch (error) {
        setResponse("Câu hỏi không liên quan đến thai kỳ.");
        triggerNextStep({ value: "Câu hỏi không liên quan đến thai kỳ." });
      }
    };

    fetchResponse();
  }, [userMessage, triggerNextStep]);

  return response ? (
    <div className="text-sky-800 font-semibold">BabyCare AI</div>
  ) : (
    <div className="">Loading...</div>
  );
};

const theme = {
  background: "#f5f8fb",
  fontFamily: "Roboto",
  headerBgColor: "#075985",
  headerFontColor: "#34D399",
  headerFontSize: "15px",
  botBubbleColor: "#075985",
  botFontColor: "#34D399",
  userBubbleColor: "#34D399",
  userFontColor: "#075985",
};

const ChatbotComponent: React.FC = () => {
  const steps = [
    {
      id: "1",
      message: "Chào mừng đến với Baby AI! Tôi có thể giúp gì cho bạn hôm nay?",
      trigger: "2",
    },
    {
      id: "2",
      user: true,
      trigger: "api-response",
    },
    {
      id: "api-response",
      component: <APIResponse />,
      waitAction: true,
      trigger: "4",
    },
    {
      id: "4",
      message: "{previousValue}",
      trigger: "5",
    },
    {
      id: "5",
      message: "Bạn còn muốn hỏi gì nữa không?",
      trigger: "6",
    },
    {
      id: "6",
      options: [
        { value: "yes", label: "Có", trigger: "2" },
        { value: "no", label: "Không", trigger: "7" },
      ],
    },
    {
      id: "7",
      message: "Được rồi! Chúc bạn một ngày tuyệt vời!",
      end: true,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <ChatBot steps={steps} />;
    </ThemeProvider>
  );
};

export default ChatbotComponent;
