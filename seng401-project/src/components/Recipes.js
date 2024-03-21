import React, { useState } from 'react';
import RecipeCard from './RecipeCard';
import './styles/Recipes.css'; // Import the CSS file
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Recipes = ({ recipes, handleSave, handleDelete }) => {
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // get length of recipes
  const recipeLength = recipes.length;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const handleExpand = (recipeId) => {
    if (expandedRecipe === recipeId) {
      setExpandedRecipe(null);
    } else {
      setExpandedRecipe(recipeId);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="recipe-list"> {/* Apply container class */}
      <h2>Recipe List</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a recipe"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="slider">
        <Slider {...settings}>
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} onClick={() => handleExpand(recipe.id)}>
              <RecipeCard
                // only show the title
                recipe={{ title: recipe.title }}
              />
              {expandedRecipe === recipe.id && (
                <div className="expanded-view"> {/* Apply expanded view class */}
                  <RecipeCard
                    recipe={recipe}
                    handleSave={() => handleSave(recipe.id)}
                    handleDelete={() => handleDelete(recipe.id)}
                  />
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Recipes;
