import React, { useState } from 'react';
import './styles/RecipeForm.css';
import { FaPlus } from 'react-icons/fa';

// Update InputWithButton component to handle label animation
const InputWithButton = ({ name, value, onChange, onAdd, disabled }) => {
    const [focused, setFocused] = useState(false);

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        if (!value.trim()) {
        setFocused(false);
        }
    };

    return (
        <div className={`input-group ${focused ? 'focused' : ''}`}>
        
        <label className = "grandpa">{name.charAt(0).toUpperCase() + name.slice(1)}</label>

        <input 
            name={name} 
            type="text" 
            value={value} 
            onChange={onChange} 
            onFocus={handleFocus} 
            onBlur={handleBlur} 
        />
        <button type="button" onClick={onAdd} disabled={disabled}>
            <FaPlus />
        </button>
        </div>
    );
};

  
export default InputWithButton;