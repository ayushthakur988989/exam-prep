// // src/components/Message.jsx
// import React, { useEffect, useState } from 'react';


// const Message = () => {
//   const [question, setQuestion] = useState('');
//   const [messages, setMessages] = useState([]);

//   const userId = localStorage.getItem('userId');
//   const userName = localStorage.getItem('userName') || '';
//   const userEmail = localStorage.getItem('userEmail') || '';

//   // ✅ Fetch user's previous messages
//   const fetchUserMessages = async () => {
//     if (!userId) return;
//     try {
//       const res = await axios.get(`https://exam-prep-1v8x.onrender.com/api/message/user/${userId});
//       setMessages(res.data.message || []);
//     } catch (err) {
//       console.error('❌ Error fetching user messages:', err);
//       alert('Failed to fetch messages. Please try again later.');
//     }
//   };

//   useEffect(() => {
//     fetchUserMessages();
//   }, []);

//   // ✅ Send a new message
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!question.trim()) {
//       return alert('⚠ Please type your feedback first!');
//     }
//     try {
//       await axios.post('https://exam-prep-1v8x.onrender.com/api/message', {
//         question,
//         examineeId: userId
//       });
//       setQuestion('');
//       fetchUserMessages();
//       alert('✅ Feedback sent successfully!');
//     } catch (err) {
//       console.error('❌ Error sending message:', err);
//       alert('Failed to send message. Try again later.');
//     }
//   };

//   // ✅ Edit an existing message
//   const editMyMessage = async (id, currentText) => {
//     const newText = prompt('Edit your message:', currentText);
//     if (newText === null || !newText.trim()) return;
//     try {
//       await axios.put(https://exam-prep-1v8x.onrender.com/api/message/edit/${id}, {
//         question: newText,
//         role: 'user',
//         userId
//       });
//       fetchUserMessages();
//       alert('✏ Message updated successfully!');
//     } catch (err) {
//       console.error('❌ Error editing message:', err);
//       alert('Failed to edit message.');
//     }
//   };

//   // ✅ Delete a message
//   const deleteByUser = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this message?')) return;
//     try {
//       await axios.put(https://exam-prep-1v8x.onrender.com/api/message/delete/${id}, {
//         role: 'user',
//         userId
//       });
//       fetchUserMessages();
//       alert('🗑 Message deleted successfully!');
//     } catch (err) {
//       console.error('❌ Error deleting message:', err);
//       alert('Failed to delete message.');
//     }
//   };

//   return (
//     <div className="container p-3">
//       <h2 className="mb-3 text-primary">Send Feedback to Admin</h2>

//       {/* Feedback Form */}
//       <form onSubmit={sendMessage} className="mb-3">
//         <textarea
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           className="form-control mb-2"
//           placeholder="Type your feedback..."
//           rows="3"
//         />
//         <button type="submit" className="btn btn-primary w-100">Submit</button>
//       </form>

//       <hr />

//       {/* Display Messages */}
//       <h3 className="mt-3">Your Messages</h3>
//       <table className="table table-bordered text-center mt-2">
//         <thead className="table-light">
//           <tr>
//             <th>S.No.</th>
//             <th>Feedback</th>
//             <th>Admin Reply</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {messages.length === 0 ? (
//             <tr>
//               <td colSpan="4" className="text-muted">No feedback submitted yet.</td>
//             </tr>
//           ) : (
//             messages.map((msg, idx) => (
//               <tr key={msg._id}>
//                 <td>{idx + 1}</td>
//                 <td>{msg.question}</td>
//                 <td>{msg.answer || 'No reply yet'}</td>
//                 <td>
//                   <button
//                     className="btn btn-sm btn-warning me-2"
//                     onClick={() => editMyMessage(msg._id, msg.question)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => deleteByUser(msg._id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Message;