import axios from "axios";
import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import Cookies from "js-cookie";
import { BASE_URL } from "@/services/config";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
  image: string;
}

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
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // Loading for messages

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

  // Fetch users with caching
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const cachedUsers = localStorage.getItem("cached_users");
      if (cachedUsers) {
        setUsers(JSON.parse(cachedUsers));
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/employees/get-all-employee`);
      if (response.data?.resultObj && Array.isArray(response.data.resultObj)) {
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
        localStorage.setItem("cached_users", JSON.stringify(filteredUsers)); // Cache users
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch chat history with caching
  const fetchChatHistory = async (senderId: any, receiverId: any) => {
    setIsLoadingMessages(true); // Show loading for messages
    const cacheKey = `chat_${senderId}_${receiverId}`;
    const cachedMessages = localStorage.getItem(cacheKey);

    if (cachedMessages) {
      setMessages(JSON.parse(cachedMessages));
      setIsLoadingMessages(false); // Hide loading after loading from cache
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/chat/get-message`, {
        params: { senderId, receiverId },
      });
      const fetchData = response.data.map((item: any) => ({
        message: item.message,
        senderId: item.senderId.id,
        sendAt: item.sendAt,
      }));

      setMessages(fetchData);
      localStorage.setItem(cacheKey, JSON.stringify(fetchData)); // Cache messages
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setIsLoadingMessages(false); // Hide loading after fetching data
    }
  };

  // Reset localStorage on page load or URL change
  useEffect(() => {
    localStorage.clear(); // Clear localStorage when the page is loaded
  }, []);

  // Handle user selection and chat
  const handleSelectUser = (user: User) => {
    if (user.id === userID) {
      setErrorMessage("You cannot chat with yourself.");
      setSelectedUser(null);
      return;
    }

    setErrorMessage("");
    setSelectedUser(user);
    fetchChatHistory(user.id, userID);  // Fetch messages for the selected user
  };

  const sendMessage = async () => {
    if (!newMessage || !selectedUser || !userID) {
      console.error("UserID or SelectedUser is undefined");
      return;
    }
  
    try {
      setIsLoadingChat(true);
      const newMessageData = {
        message: newMessage,
        senderId: userID,
        sendAt: new Date().toISOString(),
      };
  
      // Cập nhật tin nhắn vào state của người gửi
      setMessages((prevMessages) => [
        ...prevMessages,
        newMessageData,
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
  
          // Lưu tin nhắn vào localStorage cho cả người gửi và người nhận
          const senderCacheKey = `chat_${userID}_${selectedUser.id}`;
          const senderCachedMessages = localStorage.getItem(senderCacheKey);
          const updatedSenderMessages = senderCachedMessages
            ? [...JSON.parse(senderCachedMessages), { message: messageContent, senderId: userId, sendAt: new Date().toISOString() }]
            : [{ message: messageContent, senderId: userId, sendAt: new Date().toISOString() }];
          localStorage.setItem(senderCacheKey, JSON.stringify(updatedSenderMessages));
  
          const receiverCacheKey = `chat_${selectedUser.id}_${userID}`;
          const receiverCachedMessages = localStorage.getItem(receiverCacheKey);
          const updatedReceiverMessages = receiverCachedMessages
            ? [...JSON.parse(receiverCachedMessages), { message: messageContent, senderId: userId, sendAt: new Date().toISOString() }]
            : [{ message: messageContent, senderId: userId, sendAt: new Date().toISOString() }];
          localStorage.setItem(receiverCacheKey, JSON.stringify(updatedReceiverMessages));
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
  

  useEffect(() => {
    if (userID) {
      fetchUsers();
    }
  }, [userID]);

  useEffect(() => {
    if (userID && selectedUser) {
      const channelName = `chat-${userID.localeCompare(selectedUser.id) < 0 ? userID : selectedUser.id}-${userID.localeCompare(selectedUser.id) < 0 ? selectedUser.id : userID}`;
      const channel = pusher.subscribe(channelName);
  
      // Lắng nghe sự kiện "new-message" từ người gửi
      channel.bind("new-message", (data: { messageContent: string; senderId: string; sendAt: string }) => {
        if (data.senderId !== userID) {
          // Cập nhật tin nhắn vào giao diện người nhận
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              message: data.messageContent,
              senderId: data.senderId,
              sendAt: data.sendAt || new Date().toISOString(),
            },
          ]);
  
          // Cập nhật tin nhắn vào localStorage cho người nhận
          const cacheKey = `chat_${selectedUser.id}_${userID}`;
          const cachedMessages = localStorage.getItem(cacheKey);
          const updatedMessages = cachedMessages
            ? [...JSON.parse(cachedMessages), { message: data.messageContent, senderId: data.senderId, sendAt: data.sendAt || new Date().toISOString() }]
            : [{ message: data.messageContent, senderId: data.senderId, sendAt: data.sendAt || new Date().toISOString() }];
          localStorage.setItem(cacheKey, JSON.stringify(updatedMessages)); // Lưu vào localStorage cho người nhận
        }
      });
  
      return () => {
        pusher.unsubscribe(channelName);
      };
    }
  }, [userID, selectedUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex bg-sky-100 m-4 rounded-lg">
      {/* Left Column: Users */}
      <div className="w-[300px] bg-sky-200 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded-lg mb-2"
        />
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          {users.length > 0 ? (
            users
              .filter((user) =>
                user.userName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <li
                  key={user.id}
                  className="p-4 mb-2 bg-sky-800 rounded-md text-emerald-400 cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
                    <img
                      src={user.image || "https://via.placeholder.com/150"}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <strong>{user.userName}</strong>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <small>{user.role}</small>
                    </div>
                  </div>
                </li>
              ))
          ) : (
            <div>No users available.</div>
          )}
        </ul>
      </div>

      {/* Right Column: Messages */}
      {selectedUser ? (
        <div className="h-[650px] flex-1 bg-sky-100 p-10 rounded-lg">
          <h2 className="text-sky-800 font-semibold">{selectedUser.userName}</h2>
          <div style={{ height: "calc(100% - 80px)", overflowY: "scroll" }}>
            {isLoadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <span>Loading...</span> {/* Hiển thị spinner hoặc loading ở đây */}
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} style={{ textAlign: msg.senderId === userID ? "right" : "left" }}>
                  <div className={`inline-block p-2 rounded-lg ${msg.senderId === userID ? "bg-sky-200" : "bg-white"}`}>
                    <p>{msg.message}</p>
                    <small>{msg.senderId === userID ? formatTimeForSender(msg.sendAt) : formatTimeForReceiver(msg.sendAt)}</small>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message"
              className="flex-1 p-2 rounded-lg mr-2"
            />
            <button onClick={sendMessage} className="px-4 py-2 bg-sky-800 text-emerald-400 rounded-lg">
              {isLoadingChat ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <div className="h-[650px] flex-1 flex items-center justify-center">
          Please select a user to chat
        </div>
      )}
      {errorMessage && <div className="text-red-600">{errorMessage}</div>}
    </div>
  );
};

export default ChatDashboard;