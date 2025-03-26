import React, { useEffect, useState } from "react";
// @ts-ignore
import ChatBot from "react-simple-chatbot";
// @ts-ignore
import { ThemeProvider } from "styled-components";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useParams } from "react-router-dom";
import { CookiesService } from "@/services/cookies.service";

const APIResponse: React.FC = ({ steps, triggerNextStep }: any) => {
  const userMessage = steps["2"].value;
  const [, setResponse] = useState("");
  const { id } = useParams();
  const userId = CookiesService.get();

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const { data } = await axios.post(
          `${BASE_URL}/ai-child/get-answer-child`,
          {
            question: userMessage,
            userId,
            childId: id,
          }
        );

        setResponse(data.message);

        triggerNextStep({ value: data.message });
      } catch (error) {
        setResponse("Sorry, something went wrong.");
        triggerNextStep({ value: "Sorry, something went wrong." });
      }
    };

    fetchResponse();
  }, [userMessage, triggerNextStep]);
  return (
    <div className="text-sky-800 font-semibold">BabyCare AI for Child</div>
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

const ChatbotComponentChild: React.FC = () => {
  const steps = [
    {
      id: "1",
      message:
        "Chào mừng đến với Baby AI Child! Tôi có thể hỗ trợ gì cho bạn về thai nhi?",
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
    <div>
      <ThemeProvider theme={theme}>
        <ChatBot
          steps={steps}
          style={{
            width: "100%",
            padding: "0",
            borderRadius: "0px",
            overflow: "hidden",
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default ChatbotComponentChild;
