import React, { useState } from 'react';
import RecipeCard from './RecipeCard';
import './styles/Recipes.css'; // Import the CSS file
// import list icon
import { FaList } from 'react-icons/fa';
// import grid icon
import { FaTh } from 'react-icons/fa';


const Recipes = ({ recipes, handleSave, handleDelete, recipesPerRow, searching, searchedRecipes, handleRegenerate }) => {

  const [searchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);

  const toggleView = () => {
    setIsGridView(prevState => !prevState);
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
  <div id="recipes">
    <div className='title'>

      <h2>Your Recipes</h2>

      <div className="view-toggle">
        <button onClick={toggleView}>{isGridView ? <FaList /> : <FaTh />}</button>
      </div>
    </div>
    <div className="recipe-list">
      <div className={`recipe-grid ${isGridView ? `recipes-per-row-${recipesPerRow}` : 'recipe-list-view'}`}>
// <<<<<<< Rimal's-Branch
//         {(searching? searchedRecipes : recipes).map((recipe) => (

        {filteredRecipes.map((recipe) => (

          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            handleSave={() => handleSave(recipe)}

            handleDelete={() => handleDelete(recipe)}
            handleRegenerate={() => handleRegenerate(recipe)}

          />
        ))}
      </div>
    </div>
  </div>

  );
};


export default Recipes;

export default Recipes;

