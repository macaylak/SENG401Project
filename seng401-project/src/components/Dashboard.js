import React, { useState } from 'react';
import axios from 'axios'; // or use fetch API

function Dashboard() {
  const [showChatBox, setShowChatBox] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleNewRecipeClick = () => {
    setShowChatBox(true);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
  
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');
  
    try {
      const response = await axios.post(
        'https://chatgpt.com/api/v1/completion/',
        {
          prompt: `Give food recipes that can be made for the food items: ${input}`,
        },
        {
          headers: {
            Authorization: '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',
            'Content-Type': 'application/json',
          },
        }
      );
  
      const botMessage = { text: response.data.choices[0].text.trim(), sender: 'bot' };
      setMessages([...messages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <div>
      {/* hide account component */}
      <style>{`
        .account {
          display: none;
        }
      `}</style>
      {/* dashboard title */}
      <h2>Dashboard</h2>
      {/* sidemenu */}
      <div className="sidemenu">
        <ul>
          <li>Profile</li>
          <li>Recipes</li>
          <li>Meal Plan</li>
          <li>Settings</li>
        </ul>
        <a href="/">Logout</a>
      </div>
      {/* main content */}
      <div className="main-content">
        {/* content goes here */}
      </div>
      {/* new recipe button */}
      <button onClick={handleNewRecipeClick}>New Recipe</button>
      {/* recipe display */}
      <div className="recipe-display">
        {/* recipe cards */}
      </div>

      {/* Chat Box */}
      {showChatBox && (
        <div className="chat-box">
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={handleInput}
              placeholder="Type food items..."
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
