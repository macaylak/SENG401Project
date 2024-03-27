import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios or use fetch API
import { addRecipe, auth, colRef, deleteRecipe } from '../../firebase';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { FaTimes, FaPlus } from 'react-icons/fa';

class DashboardModel {
  constructor() {
    this.recipes = [];
  }

  async fetchRecipes(user) {
    if (!user) return [];
    const q = query(colRef, where("user", "==", user.email));
    const fetchedRecipes = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let recipe = doc.data();
      recipe.id = doc.id;
      fetchedRecipes.push(recipe);
    });

    this.recipes = fetchedRecipes;
    return fetchedRecipes;
  }

  async searchRecipes(searchText) {
    const search = searchText.toLowerCase();
    if (search === '') {
      return this.recipes;
    }
    const q = query(colRef, where("user", "==", auth.currentUser.email));
    const filteredRecipes = [];

    const snapshot = await getDocs(q);
    snapshot.docs.forEach((doc) => {
      if (doc.data().title.toLowerCase().includes(search) || doc.data().ingredients.toLowerCase().includes(search)) {
        filteredRecipes.push(doc.data());
      }
    });

    return filteredRecipes;
  }
  async addNewRecipe(recipeData) {
    try {
      const response = await addRecipe(recipeData); // Assume addRecipe returns a promise
      this.recipes.unshift(response); // Add to the beginning of the array
      return response;
    } catch (error) {
      console.error("Error adding recipe:", error);
      throw error;
    }
  }

  async deleteRecipeById(recipeId) {
    try {
      await deleteRecipe(recipeId); // Assume deleteRecipe is a function that deletes a recipe by ID
      this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error;
    }
  }

  async saveRecipe(recipe) {
    const q = query(colRef, where("title", "==", recipe.title));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error('Recipe already saved!');
    } else {
      const newDocRef = await addDoc(colRef, recipe);
      return newDocRef.id;
    }
  }

  async regenerateRecipe(recipeInput) {
    try {
      const response = await axios.post(
        'https://us-central1-your-project-id.cloudfunctions.net/generateRecipes',
        { 
          ingredients: recipeInput.ingredients, 
          cuisine: recipeInput.cuisine, 
          diet: recipeInput.diet, 
          allergy: recipeInput.allergy
        }
      );

      if (response.status === 200 && !response.data.title.includes('recipe cannot be generated')) {
        // Assuming response.data contains the regenerated recipe information
        let regeneratedRecipe = response.data;
        regeneratedRecipe.ingredientsAvailable = recipeInput.ingredients;
        regeneratedRecipe.user = auth.currentUser.email;
        if(recipeInput.cuisine) regeneratedRecipe.cuisine = recipeInput.cuisine;
        if(recipeInput.diet) regeneratedRecipe.diet = recipeInput.diet;
        if(recipeInput.allergy) regeneratedRecipe.allergy = recipeInput.allergy;

        return regeneratedRecipe;
      } else {
        throw new Error('Recipe cannot be regenerated with the given inputs');
      }
    } catch (error) {
      console.error('Error regenerating recipe:', error);
      throw error;
    }
  }
}

export default DashboardModel;
