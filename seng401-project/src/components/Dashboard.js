// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addRecipe, auth, colRef, deleteRecipe } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getDocs, where, query } from 'firebase/firestore';
import RecipeForm from './RecipeForm'; // Import RecipeForm
import RecipeCard from './RecipeCard'; // Import RecipeCard
import Profile from './Profile';
import './styles/Dashboard.css';
import Recipes from './Recipes';
import { FaTimes } from 'react-icons/fa';

function Dashboard() {
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [content, setContent] = useState('recipes');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  var count = 0;

  useEffect(() => {
    count = 1;
  }, []);

  const username = auth.currentUser ? auth.currentUser.email.split('@')[0] : '';

  // Function to toggle the sidemenu
  const toggleSidemenu = () => {
    const sidemenu = document.querySelector('.sidemenu');
    sidemenu.classList.toggle('active');
  };

  // Function to handle content change
  const handleContentChange = (newContent) => {
    setContent(newContent);
    toggleSidemenu();
  };

  onAuthStateChanged(auth, (user) => {
    if (user && count === 1) {
      getRecipes(user);
    } else if (count !== 1) {
    } else {
      console.log('user logged out');
    }
  });

  const getRecipes = (user) => {
    if (!user) return;

    var fetchedRecipes = [];
    const q = query(colRef, where('user', '==', user.email));

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
  };

  const handleNewRecipeClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

// Function to handle submitting a new recipe
const handleSubmitNewRecipe = async (input) => {
  if (!input.ingredients.trim()) return;

  try {
    const response = await axios.post(
      'https://us-central1-pro-5d7e4.cloudfunctions.net/generateRecipes',
      { prompt: input.ingredients }
    );

    if (response.status === 200) {
      var recipeDict = response.data;
      if (recipeDict.title !== 'Recipe cannot be generated') {
        recipeDict.ingredientsAvailable = input.ingredients;
        recipeDict.user = auth.currentUser.email;

        setRecipes([recipeDict, ...recipes]);
      } else {
        alert(recipeDict.title);
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
  setShowModal(false); // Close modal after submitting
};

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleSave = async (recipe_dict) => {
    const querySnapshot = await getDocs(query(colRef, where('title', '==', recipe_dict.title)));
    if (!querySnapshot.empty) {
      alert('Recipe already saved!');
    } else {
      addRecipe(recipe_dict);
    }
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log('user signed out');
        navigate('/login');
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const handleDelete = (id) => {
    deleteRecipe(id);
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  return (
    <div>
      {/* hide account component */}
      <style>{`
        .account {
          display: none;
        }
      `}</style>
      <header>
        {/* website name */}
        <h1>Recipes4You</h1>
        <div className="header2">
          {/* content title */}
          {/* <h2>{content.charAt(0).toUpperCase() + content.slice(1)}</h2> */}
          {/* Welcome 'username' */}
          <h2>Welcome {username}</h2>
          {/* new recipe button */}
          <button id="newRecipeButton" onClick={handleNewRecipeClick}>
            +
          </button>
        </div>
      </header>
      {/* Main content */}
      <div className="main-content">
        {/* sidemenu */}
        <div className="sidemenu">
          <ul>
            <li onClick={() => handleContentChange('recipes')}>Recipes</li>
            <li onClick={() => handleContentChange('profile')}>Profile</li>
            <li>Settings</li>
            <li onClick={logOut}>Log Out</li>
          </ul>
        </div>
        <div className="content">
          {/* Render content based on user selection */}
          {content === 'recipes' && <Recipes recipes={recipes} handleSave={handleSave} handleDelete={handleDelete} />}
          {content === 'profile' && <Profile />}
        </div>
      </div>
      {/* Modal overlay */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-modal" onClick={handleCloseModal}>
              <FaTimes />
            </button>
            {/* New Recipe Form */}
            <RecipeForm handleSubmit={handleSubmitNewRecipe} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
