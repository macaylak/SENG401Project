import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';
import './styles/RecipeCard.css';

function RecipeCard({ recipe, handleSave, handleDelete }) {
  const { title, ingredients, instructions, prepTime, nutritionalFacts } = recipe;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if the recipe is already saved when the component mounts
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const isRecipeSaved = savedRecipes.some(savedRecipe => savedRecipe.title === title);
    setIsSaved(isRecipeSaved);
  }, [title]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSaveRecipe = async () => {
    setIsLoading(true);
    await handleSave();
    setIsLoading(false);
    setIsSaved(true);
    // Save the recipe title to localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    localStorage.setItem('savedRecipes', JSON.stringify([...savedRecipes, { title }]));
  };

  const handleDeleteRecipe = () => {
    handleDelete();
    // Remove the recipe title from localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const updatedRecipes = savedRecipes.filter(savedRecipe => savedRecipe.title !== title);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
    setIsSaved(false);
  };

  return (
    <>
      <div className='flip-card' onClick={toggleModal}>
        <div className='flip-card-inner'>
          <div className='flip-card-front'>
            <h3>{title}</h3>
          </div>
          <div className='flip-card-back'>
            <div className='content'>
              <ul>
                <li className="prep-time">{prepTime}</li>
                <li className="ingredients">{ingredients}</li>
                <li className="nutritional-facts">{nutritionalFacts}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h2>{title}</h2>
            <ul>
              <li>{prepTime}</li>
              <li>{ingredients}</li>
              <li>{instructions}</li>
              <li>{nutritionalFacts}</li>
            </ul>
            <div className="modal-buttons">
              {isSaved ? (
                <p>Saved!</p>
              ) : (
                <button onClick={handleSaveRecipe} disabled={isLoading}>
                  <FaCheck /> {isLoading ? 'Saving...' : 'Save'}
                </button>
              )}
              <button onClick={handleDeleteRecipe}><FaTrash /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RecipeCard;
