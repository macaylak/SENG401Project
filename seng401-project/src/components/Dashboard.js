import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios or use fetch API
import { addRecipe, auth, colRef, deleteRecipe } from '../firebase';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getDocs, where, query, onSnapshot } from 'firebase/firestore';
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
  const [searchedRecipes, setSearchedRecipes] = useState([]); // Array to store searched recipes
  const [searching, setSearching] = useState(false); // Boolean to check if user is searching
  const [regenRecipe, setRegenRecipe] = useState(false);
  var count = 0;

  useEffect(() => {
    count = 1;
    if (auth.currentUser) {
      getRecipes(auth.currentUser);
    }
  }, []);

  // useEffect(() => {
  //   console.log(auth.currentUser)
  // }, [auth.currentUser]);

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
  const handleSubmitNewRecipe = async (input, regenerate=false, oldRecipe=null) => {
    if (!input.ingredients.trim()) return;
    console.log("input", input);

    try {
      const response = await axios.post(
        'https://us-central1-pro-5d7e4.cloudfunctions.net/generateRecipes',
        { ingredients: input.ingredients, cuisine: input.cuisine, diet: input.diet, allergy: input.allergy}
      );

      if (response.status === 200) {
        var recipeDict = response.data;
        if (!recipeDict.title.includes('recipe cannot be generated')) {
          if(!regenerate) {
            recipeDict.ingredientsAvailable = input.ingredients;
            recipeDict.user = auth.currentUser.email;
            if(input.cuisine !== '') {
              recipeDict.cuisine = input.cuisine;
            }
            if(input.diet !== '') {
              recipeDict.diet = input.diet;
            }
            if(input.allergy !== '') {
              recipeDict.allergy = input.allergy;
            }
            setRecipes([recipeDict, ...recipes]);
          }
          else {
            // setRecipes((recipes.filter((r) => r.title !== oldRecipe.title)));
            var oldTitle = oldRecipe.title;
            oldRecipe.title = recipeDict.title;
            oldRecipe.ingredients = recipeDict.ingredients;
            oldRecipe.instructions = recipeDict.instructions;
            oldRecipe.prepTime = recipeDict.prepTime;
            oldRecipe.nutritionalFacts = recipeDict.nutritionalFacts;
            setRecipes(() => {
              return recipes.map((recipe) => {
                if (recipe.title === oldTitle) {
                  return oldRecipe;
                }
                return recipe;
              });
            });
            console.log("recipes", recipes) 
          }
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
    var id = '';
    getDocs(query(colRef, where("title", "==", recipe.title)))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        console.log(doc.data());  
        id = doc.id;
      });

      if(id !== '') {
        deleteRecipe(id);
      }
      setRecipes(recipes.filter((r) => r.title !== recipe.title));
    })
    .catch((err) => {
      console.log(err.message);
    });
    console.log("id", id);
  }

  const handleSearch = (e) => {
    // query(colRef, where("title", "==", recipe_dict.title))
    const search = e.target.value.toLowerCase();
    if (search === '') {
      setSearching(false);
      return;
    }
    setSearching(true);
    const q = query(colRef, where("user", "==", auth.currentUser.email));
    onSnapshot(q, (snapshot) => {
      let filteredRecipes = [];

      snapshot.docs.forEach((doc) => {
        if (doc.data().title.includes(search) || doc.data().ingredients.includes(search)) {
          filteredRecipes.push(doc.data());
        }
      })
      setSearchedRecipes(filteredRecipes);
    })
  }

  const handleRegenerate = async (recipe) => {
    setRegenRecipe(true);
    console.log("hello", recipe)
    var input = {ingredients: recipe.ingredientsAvailable}
    input.cuisine = recipe.cuisine? recipe.cuisine : '';
    input.diet = recipe.diet? recipe.diet : '';
    input.allergy = recipe.allergy? recipe.allergy : '';

    await handleSubmitNewRecipe(input, true, recipe);
    setRegenRecipe(false);
    console.log("recipes", recipes)

    // handleDelete(recipe);
    // save things like cuisine, diet, allergy, then regenerate
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
            <button className='DashboardButton' onClick={logOut}>Logout</button>
          </ul>
          <div class="search-container">
            <input type="text" placeholder="Find Recipes By Title or Ingredients" class="search-bar" onChange={(e) => {handleSearch(e)}}></input>
          </div>
        </div>
      </div>
      <main>
      <div className="content">
        {/* Render content based on user selection */}
        {content === 'recipes' && <Recipes recipes={recipes} handleSave={handleSave} handleDelete={handleDelete} searching={searching} searchedRecipes={searchedRecipes} handleRegenerate={handleRegenerate}  />}
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