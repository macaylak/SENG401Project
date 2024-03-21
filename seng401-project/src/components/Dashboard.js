import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios'; // Import Axios or use fetch API
import {addRecipe, auth, colRef, deleteRecipe} from '../firebase'; 
import { signOut, onAuthStateChanged } from "firebase/auth";
import {useNavigate} from 'react-router-dom';
import { getDocs, where, query, doc } from 'firebase/firestore';
import './styles/Dashboard.css';


function Dashboard() {
  const [showChatBox, setShowChatBox] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  // const colRef = collection(db, 'recipes');
  var count = 0;

  useEffect(() => {
    count = 1;
  }, []);

  // useEffect(() => {
  //   // console.log(auth.currentUser.email);
  //   getRecipes(auth.currentUser);
  //   console.log(auth.currentUser)
  // }, [auth.currentUser]);
  // console.log(auth.currentUser)

  // console.log(auth.currentUser)

  // console.log(auth.currentUser.email)

  onAuthStateChanged(auth, (user) => {
    if (user && count === 1) {
      // console.log('user logged in: ', user);
      // count++;
      getRecipes(user);
    } else if (count !== 1) {
    } else {
      console.log('user logged out');
    }
  })

  // useEffect(() => {
  //   console.log(recipes);
  // }, [recipes]);

  const getRecipes = (user) => {
    if (!user) return;
    
    var fetchedRecipes = [];
    const q = query(colRef, where("user", "==", user.email));

    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (!recipes.some((recipe) => recipe.id === doc.id)) {
            let recipe = doc.data();
            recipe.id = doc.id;
            fetchedRecipes.push(recipe);
          }
        });
        setRecipes([...recipes, ...fetchedRecipes]);
      })
      .catch((err) => {
        console.log(err.message);
      });

  }

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
        'https://us-central1-pro-5d7e4.cloudfunctions.net/generateRecipes',
        { prompt: input }
      );
  
      if (response.status === 200) {
        var recipe_dict = response.data;
        if (recipe_dict.title !== "Recipe cannot be generated") {
          recipe_dict.ingredientsAvailable = input;
          recipe_dict.user = auth.currentUser.email;
  
          const botMessage = { text: response.data, sender: 'bot' };
          setMessages([...messages, botMessage]);
  
       
          setRecipes([recipe_dict, ...recipes]);
        } else {
          alert(recipe_dict.title);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
 

  const handleSave = async (recipe_dict) => {
    const querySnapshot = await getDocs(query(colRef, where("title", "==", recipe_dict.title)));
    if (!querySnapshot.empty) {
      alert('Recipe already saved!');
    } else {
      addRecipe(recipe_dict);
    }
  }
  
  

  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("user signed out");
        navigate('/login');
      })
      .catch((err) => {
        console.error(err.message);
      })
  }

  const handleDelete = (id) => {
    deleteRecipe(id);
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  }


 
  

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
          <li><a href='/profile'>Profile</a></li>
          <li>Recipes</li>
          <li>Meal Plan</li>
          <li>Settings</li>
        </ul>
        <button onClick={logOut}>Logout</button>
      </div>
      {/* main content */}
      <div className="main-content">
        {/* content goes here */}
      </div>
      {recipes.map((recipe, index) => (
              <div key={recipe.id} className={`message bot`}>
                <h3>{recipe.title}</h3>
                <pre>{recipe.ingredients}</pre>
                <pre>{recipe.instructions}</pre>
                <pre>{recipe.prepTime}</pre>
                <pre>{recipe.nutritionalFacts}</pre>
                <button onClick={() => handleSave(recipe)}>Save</button>

                <button onClick={() => handleDelete(recipe.id)}>Delete</button>
              </div>
      ))}
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