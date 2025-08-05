import React, { useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001");


function App() {
  const [message, setMessage] = React.useState("");
  const [chat, setChat] = React.useState([]);
  const typingTimeoutRef = React.useRef(null);
  const [isTyping, setIsTyping] = React.useState(false);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("sendMessage", message);
      socket.emit("stopTyping");
      setMessage("");
    }
  }
  const handleTyping = (e) =>{
     setMessage(e.target.value);
     socket.emit("typing");
     console.log("User is typing...");
     clearTimeout(typingTimeoutRef.current); // clear previous timeout
     typingTimeoutRef.current = setTimeout(() => { // add a timeout to stop typing
       socket.emit("stopTyping");
     }, 1000);
  };

  // catch the emitted message
     useEffect(() => {
       socket.on('receiveMessage', (data) => {
         setChat((prevChat) => [...prevChat, data]);
       });

       socket.on('userTyping', () => {
         setIsTyping(true);
         console.log("User is typing...T", isTyping); 
       });

       socket.on('stopTyping', () => {
         setIsTyping(false);
       });

       return () => {
         socket.off('receiveMessage');
         socket.off('userTyping');
         socket.off('stopTyping');
       };
     }, []);

  return (
    <div className='container'>
     <h1>Chat Application</h1>
     <div className="chat-container">
        {chat.map((msg, index) => (
          <div key={index} className="message">
            <p>{msg}</p>
          </div>
        ))}
        {isTyping && <p>User is typing...</p>}
     </div>
     <div className='input-container'> 
       <input type="text" 
        placeholder='Type your message...' 
        value={message}
        onChange={handleTyping}
       />
       <button onClick={sendMessage}>Send</button>
     </div>
    </div>
  );
}

export default App;
