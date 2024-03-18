import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios or use fetch API
import {auth} from '../firebase'; 

function Dashboard() {
  const [showChatBox, setShowChatBox] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [recipes, setRecipes] = useState([]);

  // useEffect(() => {
  //   console.log(auth.currentUser.email);
  // }, []);

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
        // Update the Cloud Function URL here
        'https://us-central1-pro-5d7e4.cloudfunctions.net/generateRecipes',
        { prompt: input } // Send user input as prompt
      );
      // check if response is 200
      if (response.status === 200) {
        var recipe_dict = response.data
        if (recipe_dict.title !== "Recipe cannot be generated") {

          recipe_dict.ingredientsAvailable = input
          recipe_dict.user = auth.currentUser.email

          const botMessage = { text: response.data, sender: 'bot' };
          setMessages([...messages, botMessage]);
          setRecipes([...recipes, recipe_dict]);
        }
        else {
          alert(recipe_dict.title)
        }
      }
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
            {/* {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))} */}
            {recipes.map((recipe, index) => (
              <div key={index} className={`message bot`}>
                <h3>{recipe.title}</h3>
                <p>{recipe.ingredients}</p>
                <p>{recipe.instructions}</p>
                <p>{recipe.prepTime}</p>
                <p>{recipe.nutritionalFacts}</p>
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
