

import React, { useState } from 'react';
import axios from 'axios'; // or use fetch API

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendRecipeRequest = async (foodItems) => {
    try {
      const response = await axios.post('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', {
        prompt: `Give food recipes that can be made for the food items: ${foodItems}`,
        // Add any additional headers or authentication tokens if required
      });
      
      const botMessage = { text: response.data.choices[0].text.trim(), sender: 'bot' };
      setMessages([...messages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleUserInput = (text) => {
    setInput(text);
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    sendRecipeRequest(input);
    setInput('');
  };

  return (
    <div>
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => handleUserInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;

