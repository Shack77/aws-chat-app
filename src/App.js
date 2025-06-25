import React, { useEffect, useRef, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';



const WEBSOCKET_URL = "wss://your-api-id.execute-api.us-east-2.amazonaws.com/dev";

function ChatComponent() {
  const ws = useRef(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log("WebSocket connected ✅");
    };

    ws.current.onmessage = (event) => {
      console.log("Message received:", event.data);
      setChat(prev => [...prev, event.data]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected ❌");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    const payload = {
      action: "sendMessage", // matches the route
      message: message
    };

    ws.current.send(JSON.stringify(payload));
    setMessage("");
  };

  return (
    <div>
      <h3>Chat</h3>
      <div>
        {chat.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatComponent;
