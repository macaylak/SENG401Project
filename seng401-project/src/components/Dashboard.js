import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios or use fetch API
import { addRecipe, auth, colRef, deleteRecipe } from '../firebase';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getDocs, where, query } from 'firebase/firestore';
import './styles/Dashboard.css';
import { FaTimes, FaPlus } from 'react-icons/fa';
import Recipes from './Recipes';
import RecipeForm from './RecipeForm';

function Dashboard() {
  const [input, setInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const username = auth.currentUser ? auth.currentUser.email.split('@')[0] : '';
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState('recipes');
  var count = 0;

  useEffect(() => {
    count = 1;
  }, []);

  onAuthStateChanged(auth, (user) => {
    if (user && count === 1) {
      getRecipes(user);
    } else if (count !== 1) {
    } else {
      console.log('user logged out');
    }
  })

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
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
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
        navigate('/');
      })
      .catch((err) => {
        console.error(err.message);
      })
  }


  const accountSettings = () =>{
    navigate('/Profile');
  }

  const handleDelete = (recipe) => {
    if (recipe.id) {
      deleteRecipe(recipe.id);
      setRecipes(recipes.filter((r) => r.id !== recipe.id));
    } else {
      setRecipes(recipes.filter((r) => r.title !== recipe.title));
    }
  }

  

  return (
  <div>
  <div className='HeaderItems'>
  <h1 className='webtitle'>RECIPES FOR YOU</h1>
  <p className='slogan'>Eat Well. Live Well.</p>
  <div className="menu">

    <ul>
      <button className="newRecipeButton" onClick={handleNewRecipeClick}><span class="material-icons-outlined">restaurant_menu</span> New Recipe +</button>
      <button className='Profile'onClick={accountSettings} >Account</button>
      <button className='DashboardButton' onClick={logOut}>Logout</button>
    </ul>

    <div class="search-container">
      <input type="text" placeholder="Find Recipes" class="search-bar"></input>
    </div>
  </div>
</div>




<main>
      <div className="content">
        {/* Render content based on user selection */}
        {content === 'recipes' && <Recipes recipes={recipes} handleSave={handleSave} handleDelete={handleDelete} />}
      </div>
      </main>
      {showModal && (
          <div className="modal-overlay">
            <div className="modal-form">
              <span className="close" onClick={toggleModal}>&times;</span>
              {/* New Recipe Form */}
              <RecipeForm handleSubmit={handleSubmitNewRecipe} />
            </div>
          </div>
        )}
    </div>
  );
}

export default Dashboard;