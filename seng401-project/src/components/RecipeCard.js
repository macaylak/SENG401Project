// RecipeCard.js
import React from 'react';

function RecipeCard({ recipe, handleSave, handleDelete }) {
  const { title, ingredients, instructions, prepTime, nutritionalFacts } = recipe;

  return (
    <div className="recipe-card">
      <h3>{title}</h3>
      <pre>{ingredients}</pre>
      <pre>{instructions}</pre>
      <pre>{prepTime}</pre>
      <pre>{nutritionalFacts}</pre>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default RecipeCard;
