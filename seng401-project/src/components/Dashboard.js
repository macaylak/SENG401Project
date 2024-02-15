// Dashboard.js
import React, { useState } from 'react';
import './styles/Dashboard.css';
import RecipeForm from './RecipeForm'; // Import the RecipeForm component

function Dashboard() {
  const [showRecipeForm, setShowRecipeForm] = useState(false); // State to manage visibility of RecipeForm

  const handleNewRecipeClick = () => {
    setShowRecipeForm(true); // Set showRecipeForm to true to display RecipeForm
  };

  const handleCloseRecipeForm = () => {
    setShowRecipeForm(false); // Set showRecipeForm to false to hide RecipeForm
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
      {/* Display RecipeForm if showRecipeForm is true */}
      {showRecipeForm && <RecipeForm onClose={handleCloseRecipeForm} />}
      {/* recipe display */}
      <div className="recipe-display">
        {/* recipe cards */}
      </div>
    </div>
  );
}

export default Dashboard;
