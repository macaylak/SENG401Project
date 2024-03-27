import React, { useState, useEffect } from 'react';
import { addRecipe, auth, colRef, getRecipes, logOut } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getDocs, where, query } from 'firebase/firestore';
import './styles/Dashboard.css';
import Recipes from './Recipes';
import RecipeForm from './RecipeForm';
import { handleSubmitNewRecipe, handleSearch, handleDeleteFromDB } from './controllers/DashboardController';

function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState('recipes');
  const [searchedRecipes, setSearchedRecipes] = useState([]); // Array to store searched recipes
  const [searching, setSearching] = useState(false); // Boolean to check if user is searching
  var count = 0;

  useEffect(() => {
    count = 1;
    if (auth.currentUser) {
      getRecipes(auth.currentUser, recipes, setRecipes);
    }
  }, []);

  onAuthStateChanged(auth, (user) => {
    if (user && count === 1) {
      getRecipes(user, recipes, setRecipes);
    } else if (count !== 1) {
    } else {
      console.log('user logged out');
      navigate('/login');
    }
  })

  const handleNewRecipeClick = () => {
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSave = async (recipe_dict) => {
    const querySnapshot = await getDocs(query(colRef, where("title", "==", recipe_dict.title)));
    if (!querySnapshot.empty) {
      alert('Recipe already saved!');
    } else {
      addRecipe(recipe_dict);
    }
  }

  const handleLogOut = () => {
    logOut();
  }

  const accountSettings = () =>{
    navigate('/Profile');
  }

  const handleSubmit = async (input) => {
    await handleSubmitNewRecipe(input, recipes, setRecipes, setShowModal);
  }

  const handleDelete = (recipe) => {
    handleDeleteFromDB(recipe, recipes, setRecipes);
  }

  const handleRegenerate = async (recipe) => {
    var input = {ingredients: recipe.ingredientsAvailable}
    input.cuisine = recipe.cuisine? recipe.cuisine : '';
    input.diet = recipe.diet? recipe.diet : '';
    input.allergy = recipe.allergy? recipe.allergy : '';

    await handleSubmitNewRecipe(input, recipes, setRecipes, setShowModal, true, recipe);
  }

  return (
    <div>
      <div className='HeaderItems'>
        <h1 className='webtitle'>RECIPES FOR YOU</h1>
        <p className='slogan'>Eat Well. Live Well.</p>
        <div className="menu">
          <ul>
            <button className="newRecipeButton" onClick={handleNewRecipeClick}><span class="material-icons-outlined">restaurant_menu</span>New Recipe +</button>
            <button className='Profile' onClick={accountSettings} >Account</button>
            <button className='DashboardButton' onClick={handleLogOut}>Logout</button>
          </ul>
          <div class="search-container">
            <input type="text" placeholder="Find Recipes By Title or Ingredients" class="search-bar" onChange={(e) => {handleSearch(e, setSearching, setSearchedRecipes)}}></input>
          </div>
        </div>
      </div>
      <main>
      <div className="content">
        {/* Render content based on user selection */}
        {content === 'recipes' && 
          <Recipes 
            recipes={recipes} 
            handleSave={handleSave} 
            handleDelete={handleDelete} 
            searching={searching} 
            searchedRecipes={searchedRecipes} 
            handleRegenerate={handleRegenerate} 
          />
        }
      </div>
      </main>
      {showModal && (
          <div className="modal-overlay">
            <div className="modal-form">
              <span className="close-form" onClick={toggleModal}>&times;</span>
              {/* New Recipe Form */}
              <RecipeForm handleSubmit={handleSubmit} />
            </div>
          </div>
        )}
    </div>
  );
}

export default Dashboard;