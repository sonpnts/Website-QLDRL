// import React, { useState, useEffect, useContext } from 'react';
// import { db } from '../../configs/Firebase';
// import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
// import {MyDispatchContext, MyUserContext} from '../../configs/MyContext';
// import APIs, { endpoints } from '../../configs/APIs';
// import './Style.css';

// const ChatDetailScreen = ({ roomId }) => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [khoa, setKhoa] = useState('');
//   const user = useContext(MyUserContext);
//   const dispatch = useContext(MyDispatchContext);
//   useEffect(() => {
//     if (roomId) {
//       const q = query(collection(db, `chatRooms/${roomId}/messages`), orderBy('createdAt', 'desc'));
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         let msgs = [];
//         snapshot.forEach(doc => {
//           msgs.push({ ...doc.data(), id: doc.id });
//         });
//         setMessages(msgs);
//       });
//       return () => unsubscribe();
//     }
//   }, [roomId]);

//   const sendMessage = async () => {
//     if (message.trim() && roomId) {
//       await addDoc(collection(db, `chatRooms/${roomId}/messages`), {
//         text: message,
//         createdAt: Timestamp.now(),
//         userId: user.id,
//         ten: user.first_name + ' ' + user.last_name,
//         role: user.role,
//         email: user.email,
//       });
//       setMessage('');
//     }
//   };

//   const renderUsername = (userName, userId, userRole) => {
//     let displayName = userName;
//     if (userRole === 3 && userId !== user.id) {
//       displayName += " - Trợ lý sinh viên khoa " + khoa.ten_khoa;
//     }
//     if (userId === user.id) {
//       displayName = "Bạn";
//     }
//     return displayName;
//   };

//   const renderItem = (item) => {
//     const isSentByCurrentUser = item.userId === user.id;
//     const createdAt = item.createdAt ? (item.createdAt.toDate ? item.createdAt.toDate().toLocaleString() : new Date(item.createdAt).toLocaleString()) : "Unknown time";
//     return (
//       <div className={`message ${isSentByCurrentUser ? 'message-sent' : 'message-received'}`}>
//         <p className="message-time">{createdAt}</p>
//         <p className="message-username">{renderUsername(item.ten, item.userId, item.role)}:</p>
//         <p className="message-text">{item.text}</p>
//       </div>
//     );
//   };

//   return (
//     <div className="chat-container">
//       <div className="message-list">
//         {messages.map(renderItem)}
//       </div>
//       <div className="input-container">
//         <input
//           className="message-input"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Nhập tin nhắn..."
//         />
//         <button className="send-button" onClick={sendMessage}>Gửi</button>
//       </div>
//     </div>
//   );
// };

// export default ChatDetailScreen;



