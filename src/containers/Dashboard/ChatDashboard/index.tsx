import axios from "axios";
import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import Cookies from "js-cookie";
import { BASE_URL } from "@/services/config";

interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
  image: string;
}

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const formatTimeForSender = (sendAt: string) => {
  const vnTime = dayjs(sendAt).tz("Asia/Ho_Chi_Minh");
  const now = dayjs().tz("Asia/Ho_Chi_Minh");

  if (vnTime.isSame(now, "day")) {
    return vnTime.format("HH:mm"); // Hiển thị giờ:phút nếu cùng ngày
  } else {
    return vnTime.format("DD/MM/YYYY - HH:mm:ss"); // Hiển thị ngày tháng năm: giờ:phút:giây
  }
};

const formatTimeForReceiver = (sendAt: string) => {
  const vnTime = dayjs(sendAt).tz("Asia/Ho_Chi_Minh");
  return vnTime.fromNow(); // Hiển thị "X phút trước", "X giờ trước", "2 ngày trước",...
};



const ChatDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<
  { message: string; senderId: string; sendAt: string }[]
>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const fetchChatHistory = async (senderId: any, receiverId: any) => {
    console.log(senderId)
    console.log(receiverId)
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/chat/get-message`, {
        params: {
          senderId,
          receiverId,
        },
      });
      console.log(response.data);
  
      const fetchData = response.data.map((item: any) => ({
        message: item.message,
        senderId: item.senderId.id,
        sendAt: item.sendAt
      }));
  
      setMessages(fetchData);
      console.log(fetchData);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const getEmployeeFromCookie = () => {
    const employeeCookie = Cookies.get("EMPLOYEE");
    if (employeeCookie) {
      try {
        const decodedCookie = decodeURIComponent(employeeCookie);
        const employee = JSON.parse(decodedCookie);
        return employee;
      } catch (error) {
        console.error("Failed to parse employee cookie:", error);
        return null;
      }
    }
    return null;
  };

  const employeeData = getEmployeeFromCookie();
  const userID = employeeData ? employeeData.id : "";

  const pusher = new Pusher("01567a69c62f53eeceb1", {
    cluster: "ap1",
  });

  useEffect(() => {
    if (userID && selectedUser) {
      const channelName = `chat-${
        userID.localeCompare(selectedUser.id) < 0 ? userID : selectedUser.id
      }-${
        userID.localeCompare(selectedUser.id) < 0 ? selectedUser.id : userID
      }`;
      console.log("Channel name:", channelName); // Kiểm tra kênh

      const channel = pusher.subscribe(channelName);

      // Lắng nghe sự kiện "new-message" từ người gửi
      channel.bind("new-message", (data: { messageContent: string; senderId: string; sendAt: string }) => {
        if (data.senderId !== userID) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              message: data.messageContent,
              senderId: data.senderId,
              sendAt: data.sendAt || new Date().toISOString(), // Gán giá trị mặc định nếu không có sendAt
            },
          ]);
        }
      });
      
      return () => {
        pusher.unsubscribe(channelName);
      };
    }
  }, [userID, selectedUser]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/employees/get-all-employee`
      );

      if (
        response.data &&
        response.data.resultObj &&
        Array.isArray(response.data.resultObj)
      ) {
        const filteredUsers = response.data.resultObj
          .filter((item: any) => item.id !== userID)
          .map((item: any) => ({
            id: item.id,
            userName: item.fullName,
            email: item.email,
            role: item.role.name,
            image: item.image ?? "",
          }));

        setUsers(filteredUsers);
      } else {
        console.error("Invalid data format or no users found", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectUser = (user: User) => {
    if (user.id === userID) {
      setErrorMessage("You cannot chat with yourself.");
      setSelectedUser(null);

      return;
    }

    setErrorMessage("");
    setSelectedUser(user);
    fetchChatHistory(user.id, userID);

    setMessages([]);
  };

  const sendMessage = async () => {
    if (!newMessage || !selectedUser || !userID) {
      console.error("UserID or SelectedUser is undefined");
      return;
    }
  
    try {
      setIsLoadingChat(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: newMessage,
          senderId: userID,
          sendAt: new Date().toISOString(), // Thời gian gửi tin nhắn
        },
      ]);
      setNewMessage("");
  
      const response = await axios.post(`${BASE_URL}/chat/send-message`, {
        message: newMessage,
        userID,
        recipientUserId: selectedUser.id,
      });
  
      console.log("API Response:", response.data);
  
      if (response.data && response.data.channelName) {
        const { channelName, messageContent, userId } = response.data;
  
        if (channelName && typeof channelName === "string") {
          const channel = pusher.subscribe(channelName);
  
          // Gửi sự kiện đến người nhận qua Pusher
          channel.trigger("client-new-message", {
            message: messageContent,
            sender: userId,
          });
        }
      } else {
        console.error("No channel name received from API.");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoadingChat(false);
    }
  };
  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className=" flex bg-sky-100 m-4 rounded-lg">
      <div className="w-[300px] bg-sky-200 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          className="w-full p-2 rounded-lg mb-2"
        />

        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          {users.length > 0 ? (
            users
              .filter(
                (user) =>
                  user.userName.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ Lọc theo tên
              )
              .map((user) => (
                <li
                  key={user.id}
                  className="p-4 mb-2 bg-sky-800 rounded-md text-emerald-400 cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
                    <img
                      src={
                        user.image ||
                        "https://th.bing.com/th/id/R.869baf58b63f64a47cd521691eae7bf6?rik=%2bjP33WJBQzowcA&pid=ImgRaw&r=0"
                      }
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <strong className="text-lg text-gray-900">
                        {user.userName}
                      </strong>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <small className="text-xs text-gray-500">
                        {user.role}
                      </small>
                    </div>
                  </div>
                </li>
              ))
          ) : (
            <div>No users available or data format is incorrect.</div>
          )}
        </ul>
      </div>

      {selectedUser ? (
        <div className="h-[650px] flex-1 bg-sky-100 p-10 rounded-lg">
          <h2 className="px-10 py-2 text-sky-800 font-semibold">
            {selectedUser.userName}
          </h2>

          <div
            style={{
              height: "calc(100% - 80px)",
              overflowY: "scroll",
              marginBottom: "10px",
            }}
          >
            {messages.map((msg, index) => {
              return (
              <div key={index} style={{ textAlign: msg.senderId === userID ? "right" : "left" }}>
                <div className={`inline-block mr-4 p-2 rounded-lg max-w-[70%] break-words whitespace-pre-wrap box-border ${
                  msg.senderId === userID ? "bg-sky-200 text-sky-700" : "bg-white"
                }`}>
                  <p>{msg.message}</p>
                  <small className="text-xs text-gray-500 block mt-1">
                    {msg.senderId === userID
                      ? formatTimeForSender(msg.sendAt) // Định dạng cho người gửi
                      : formatTimeForReceiver(msg.sendAt) // Định dạng cho người nhận
                    }
                  </small>
                </div>
              </div>
              );
            })}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message"
              className="flex-1 p-2 rounded-lg mr-2"
            />
            <button
              disabled={isLoadingChat}
              onClick={sendMessage}
              className="px-4 py-2 bg-sky-800 text-emerald-400 rounded-lg"
            >
              {isLoadingChat ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <div className="h-[650px] flex-1 flex items-center justify-center">
          Please select a user to chat
        </div>
      )}

      {errorMessage && (
        <div style={{ color: "red", padding: "10px" }}>{errorMessage}</div>
      )}
    </div>
  );
};

export default ChatDashboard;
