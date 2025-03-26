import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import ChatbotComponentChild from "./ChatbotComponentChild";

const ChatbotChild: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-sm bg-sky-900 text-emerald-400">
        Baby AI Child
      </DialogTrigger>
      <DialogContent className=" p-0 overflow-hidden">
        <ChatbotComponentChild />
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotChild;
