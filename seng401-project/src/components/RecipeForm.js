import React, { useState } from 'react';
import './styles/RecipeForm.css';
import { FaPlus, FaTimes } from 'react-icons/fa';

const InputWithButton = ({ name, value, onChange, onAdd, disabled }) => {
  return (
    <div className="input-group">
      <label>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
      <input name={name} type="text" value={value} onChange={onChange} />
      <button type="button" onClick={onAdd} disabled={disabled}>
        <FaPlus />
      </button>
    </div>
  );
};

function RecipeForm({ handleSubmit }) {
  const [inputs, setInputs] = useState({
    ingredients: '',
    cuisine: '',
    diet: '',
    allergy: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ingredientList, setIngredientList] = useState([]);
  const [cuisineList, setCuisineList] = useState([]);
  const [dietList, setDietList] = useState([]);
  const [allergyList, setAllergyList] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    
  };

  const handleAddToList = (list, setList, inputValue) => {
    if (inputValue.trim() !== '') {
      setList([...list, inputValue]);
      setInputs({ ...inputs, [list]: '' });

    }
  };

  const handleDeleteFromList = (list, setList, index) => {
    const updatedList = [...list];
    updatedList.splice(index, 1);
    setList(updatedList);
  };

  const onSubmit = async () => {
    if (Object.values(inputs).every((value) => value.trim() === '') && ingredientList.length === 0) {
      setError('Please fill in at least one field');
      return;
    }

    setIsLoading(true);
    await handleSubmit({ ...inputs, ingredients: ingredientList.join(', ') });
    setInputs({ ingredients: '', cuisine: '', diet: '', allergy: '' });
    setIngredientList([]);
    setIsLoading(false);
    setError('');
  };

  return (
    <div className="recipe-form">
      <h2>Generate a new Recipe</h2>
      <form>
        <InputWithButton
          name="ingredients"
          value={inputs.ingredients}
          onChange={handleInputChange}
          onAdd={() => handleAddToList(ingredientList, setIngredientList, inputs.ingredients)}
          disabled={inputs.ingredients.trim() === ''}
        />
        {ingredientList.length > 0 && (
          <div className="ingredient-list">
            <ul>
              {ingredientList.map((ingredient, index) => (
                <li key={index}>
                  {ingredient}{' '}
                  <button type="button" onClick={() => handleDeleteFromList(ingredientList, setIngredientList, index)}>
                    <FaTimes size="lg" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <InputWithButton
          name="cuisine"
          value={inputs.cuisine}
          onChange={handleInputChange}
          onAdd={() => handleAddToList(cuisineList, setCuisineList, inputs.cuisine)}
          disabled={inputs.cuisine.trim() === ''}
        />
        {cuisineList.length > 0 && (
          <div className="cuisine-list">
            <ul>
              {cuisineList.map((cuisine, index) => (
                <li key={index}>
                  {cuisine}{' '}
                  <button type="button" onClick={() => handleDeleteFromList(cuisineList, setCuisineList, index)}>
                    <FaTimes size="lg" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <InputWithButton
          name="diet"
          value={inputs.diet}
          onChange={handleInputChange}
          onAdd={() => handleAddToList(dietList, setDietList, inputs.diet)}
          disabled={inputs.diet.trim() === ''}
        />
        {dietList.length > 0 && (
          <div className="diet-list">
            <ul>
              {dietList.map((diet, index) => (
                <li key={index}>
                  {diet}{' '}
                  <button type="button" onClick={() => handleDeleteFromList(dietList, setDietList, index)}>
                    <FaTimes size="lg" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <InputWithButton
          name="allergy"
          value={inputs.allergy}
          onChange={handleInputChange}
          onAdd={() => handleAddToList(allergyList, setAllergyList, inputs.allergy)}
          disabled={inputs.allergy.trim() === ''}
        />
        {allergyList.length > 0 && (
          <div className="allergy-list">
            <ul>
              {allergyList.map((allergy, index) => (
                <li key={index}>
                  {allergy}{' '}
                  <button type="button" onClick={() => handleDeleteFromList(allergyList, setAllergyList, index)}>
                    <FaTimes size="lg" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Error message */}
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* Submit button */}
      <button className="submitButton" onClick={onSubmit} disabled={isLoading}>
        {isLoading ? 'Cooking...' : 'Submit'}
      </button>
    </div>
  );
}

export default RecipeForm;
