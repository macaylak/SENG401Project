import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash, FaRedo } from 'react-icons/fa';
import './styles/RecipeCard.css';

function RecipeCard({ recipe, handleSave, handleDelete, handleRegenerate }) {
  const { title, ingredients, instructions, prepTime, nutritionalFacts } = recipe;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isRegenLoading, setIsRegenLoading] = useState(false);
  
  // recipesection = {name, content}

  const prepTimeList = prepTime.split('\n');
  const ingredientsList = ingredients.split('\n');

  // useEffect(() => {
  //   if(recipe.id) {
  //     setIsSaved(true);
  //     return;
  //   }
  // });



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
    setIsSaveLoading(true);
    await handleSave();
    setIsSaveLoading(false);
    setIsSaved(true);
    // Save the recipe title to localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    localStorage.setItem('savedRecipes', JSON.stringify([...savedRecipes, { title }]));
  };

  const handleDeleteRecipe = () => {
    handleDelete(); 
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const updatedRecipes = savedRecipes.filter(savedRecipe => savedRecipe.title !== title);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
    //setIsSaved(false);

  
  };

  const handleRegenerateClick = async () => {
    setIsRegenLoading(true);
    await handleRegenerate();
    // handleDeleteRecipe();
    setIsRegenLoading(false);
  }
  

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
                <li className="nutritional-facts">
                  <h4>Nutritional Facts</h4>
                  <ul>
                    {nutritionalFacts.split('\n').map((fact, index) => (
                      <li key={index}>{fact}</li>
                    ))}
                  </ul>
                </li>
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
            <h4  className="timeH">Time</h4>
              {prepTimeList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
              <li className="ingredients">
                <h4  className="ingredientsH">Ingredients</h4>
                <ul>
                  {ingredientsList.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </li>
              <li className="instructions">
                <h4 className="instructionsH">Instructions</h4>
                <ol>
                  {instructions.split('\n').map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </li>
              <li className="nutritional-facts2">
                <h4 className="nutritional-facts2H" >Nutritional Facts</h4>
                <ul>
                  {nutritionalFacts.split('\n').map((fact, index) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ul>
              </li>
            </ul>
            <div className="modal-buttons">
              {isSaved ? (
                <p>Saved!</p>
              ) : (
                <>
                  <button disabled={isRegenLoading} onClick={handleRegenerateClick}>
                    {/* Regenerate <FaRedo/> */}
                    <FaRedo/>{isRegenLoading ? 'Cooking...' : 'Regenerate'}
                  </button>
                  <button onClick={handleSaveRecipe} disabled={isSaveLoading}>
                    <FaCheck/> {isSaveLoading ? 'Saving...' : 'Save'}
                  </button>
                </>
              )}
              <button onClick={handleDeleteRecipe}><FaTrash/></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RecipeCard;
