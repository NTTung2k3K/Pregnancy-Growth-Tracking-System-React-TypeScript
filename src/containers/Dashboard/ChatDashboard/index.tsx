import axios from 'axios';
import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import Cookies from 'js-cookie';

const BASE_URL = 'https://babycare.up.railway.app/api';

interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
}

const ChatDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<{ message: string; senderId: string; messageContent?: string }[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const getEmployeeFromCookie = () => {
    const employeeCookie = Cookies.get('EMPLOYEE');
    if (employeeCookie) {
      try {
        const decodedCookie = decodeURIComponent(employeeCookie);
        const employee = JSON.parse(decodedCookie);
        return employee;
      } catch (error) {
        console.error('Failed to parse employee cookie:', error);
        return null;
      }
    }
    return null;
  };

  const employeeData = getEmployeeFromCookie(); 
  const userID = employeeData ? employeeData.id : '';

  const pusher = new Pusher('01567a69c62f53eeceb1', {
    cluster: 'ap1',
  });

  useEffect(() => {
    if (userID && selectedUser) {
      const channelName = `chat-${userID.localeCompare(selectedUser.id) < 0 ? userID : selectedUser.id}-${userID.localeCompare(selectedUser.id) < 0 ? selectedUser.id : userID}`;
      console.log("Channel name:", channelName);  // Kiểm tra kênh
  
      const channel = pusher.subscribe(channelName);
  
      // Lắng nghe sự kiện "new-message" từ người gửi
      channel.bind('new-message', (data: { messageContent: string, senderId: string }) => {
        if (data.senderId !== userID) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: data.messageContent, senderId: data.senderId, messageContent: data.messageContent }
          ]);
        }
      });
  
      return () => {
        pusher.unsubscribe(channelName);
      };
    }
  }, [userID, selectedUser]);
  

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/employees/get-all-employee`);

      if (response.data && response.data.resultObj && Array.isArray(response.data.resultObj)) {
        const filteredUsers = response.data.resultObj
          .filter((item: any) => item.id !== userID)
          .map((item: any) => ({
            id: item.id,
            userName: item.fullName,
            email: item.email,
            role: item.role.name,
          }));

        setUsers(filteredUsers);
      } else {
        console.error('Invalid data format or no users found', response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
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

    setErrorMessage('');
    setSelectedUser(user);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!newMessage || !selectedUser || !userID) {
      console.error('UserID or SelectedUser is undefined');
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/chat/send-message`, {
        message: newMessage,
        userID,
        recipientUserId: selectedUser.id,
      });
  
      console.log('API Response:', response.data);
  
      if (response.data && response.data.channelName) {
        const { channelName, messageContent, userId } = response.data;
  
        if (channelName && typeof channelName === 'string') {
          const channel = pusher.subscribe(channelName);
          
          // Gửi sự kiện đến người nhận qua Pusher
          channel.trigger('client-new-message', {
            message: messageContent,
            sender: userId,
          });
  
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: messageContent, senderId: userId, messageContent: messageContent }
          ]);
          setNewMessage('');
        } else {
          console.error('Invalid channel name:', channelName);
        }
      } else {
        console.error('No channel name received from API.');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
<div style={{ width: '300px', backgroundColor: '#F0F5FF', padding: '10px', height: '100vh' }}>
  <input
    type="text"
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
  />

  <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
    {users.length > 0 ? (
      users
        .filter((user) =>
          user.userName.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ Lọc theo tên
        )
        .map((user) => (
          <li
            key={user.id}
            style={{
              padding: '10px',
              borderBottom: '1px solid #ccc',
              cursor: 'pointer',
              backgroundColor: '#fff',
              marginBottom: '5px',
            }}
            onClick={() => handleSelectUser(user)}
          >
            <div>
              <strong>{user.userName}</strong>
              <p>{user.email}</p>
              <small>{user.role}</small>
            </div>
          </li>
        ))
    ) : (
      <div>No users available or data format is incorrect.</div>
    )}
  </ul>
</div>

      {selectedUser ? (
    <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', height: '100vh', overflowY: 'scroll' }}>
      <h2>{selectedUser.userName}</h2>
      <div style={{ height: 'calc(100% - 80px)', overflowY: 'scroll', marginBottom: '10px' }}>
      {messages.map((msg, index) => {
          console.log("Message content:", msg.messageContent); // In ra giá trị của messageContent
          return (
            <div
              key={index}
              style={{
                display: 'block', // ✅ mỗi tin nhắn chiếm nguyên dòng
                marginBottom: '10px',
                textAlign: msg.senderId === userID ? 'right' : 'left',
              }}
            >
              <div
                style={{
                  display: 'inline-block',                 // vẫn giữ inline để giới hạn chiều rộng
                  backgroundColor: msg.senderId === userID ? '#DCF8C6' : '#F1F1F1',
                  padding: '10px',
                  borderRadius: '10px',
                  maxWidth: '70%',
                  overflowWrap: 'anywhere',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  boxSizing: 'border-box',
                }}
              >
              {/* Hiển thị messageContent cho người nhận */}
              <p>{msg.senderId === userID ? msg.message : msg.messageContent}</p>
            </div>
          </div>
          );
        })}
      </div>
    <div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message"
        style={{ width: '80%', padding: '10px', borderRadius: '5px', overflowX: 'auto',whiteSpace: 'nowrap',}}
      />
      <button onClick={sendMessage} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#4CAF50' }}>
        Send
      </button>
    </div>
  </div>
) : (
  <div>Please select a user to chat.</div>
)}


      {errorMessage && <div style={{ color: 'red', padding: '10px' }}>{errorMessage}</div>}
    </div>
  );
};

export default ChatDashboard;