// RecipeCard.js
import React, { useState } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';
import './styles/RecipeCard.css';

function RecipeCard({ recipe, handleSave, handleDelete }) {
  const { title, ingredients, instructions, prepTime, nutritionalFacts } = recipe;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className='flip-card' onClick={toggleModal}>
        <div className='flip-card-inner'>
          <div className='flip-card-front'>
            <h3>{title}</h3>

            {/* <div className= 'front-content'>
              <img src={ ai image perhaps }/>
              <h3>{title}</h3>
              <p>{prepTime}</p>
            </div> */}

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
              <button onClick={handleSave}><FaCheck/></button>
              <button onClick={handleDelete}><FaTrash/></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RecipeCard;
