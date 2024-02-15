// RecipeForm.js
import React, { useState, useRef, useEffect } from 'react';
import './styles/RecipeForm.css';

const RecipeForm = ({ onClose }) => {
  const [ingredients, setIngredients] = useState('');
  const [includeFitnessGoals, setIncludeFitnessGoals] = useState(false);
  const [cuisine, setCuisine] = useState('');
  const [mealType, setMealType] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleChangeIngredients = (event) => {
    setIngredients(event.target.value);
  };

  const handleChangeFitnessGoals = (event) => {
    setIncludeFitnessGoals(event.target.checked);
  };

  const handleChangeCuisine = (event) => {
    setCuisine(event.target.value);
  };

  const handleChangeMealType = (event) => {
    setMealType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Construct the user input object to send to the API
    const userInput = {
      ingredients,
      includeFitnessGoals,
      cuisine,
      mealType,
    };

    // Make API call to ChatGPT to generate recipe based on user input
    try {
      const response = await fetch('API_ENDPOINT_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });
      const data = await response.json();
      setGeneratedRecipe(data.recipe); // Assuming the API returns the generated recipe
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-background">
      <div ref={formRef} className="recipe-form-container">
        <button className="exit-button" onClick={onClose}>X</button> {/* Exit button */}
        <h2>Create Recipe</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Ingredients:
            <input
              type="text"
              value={ingredients}
              onChange={handleChangeIngredients}
              placeholder="Enter ingredients..."
            />
          </label>
          <label>
            Cuisine:
            <input
              type="text"
              value={cuisine}
              onChange={handleChangeCuisine}
              placeholder="Enter cuisine..."
            />
          </label>
          <label>
            Meal Type:
            <input
              type="text"
              value={mealType}
              onChange={handleChangeMealType}
              placeholder="Breakfast, Lunch, Dinner..."
            />
          </label>
          <label>
            Include Your Fitness Goals:
            <input
              type="checkbox"
              checked={includeFitnessGoals}
              onChange={handleChangeFitnessGoals}
            />
          </label>
          <br />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating Recipe...' : 'Generate Recipe'}
          </button>
        </form>
        {generatedRecipe && (
          <div>
            <h3>Generated Recipe:</h3>
            <p>{generatedRecipe}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeForm;
