import DashboardController from './DashboardController';
import DashboardModel from '../models/DashboardModel';
import { addRecipe, auth, colRef, deleteRecipe } from '../../firebase.js';



jest.mock('../../firebase', () => ({
    colRef: jest.fn(),
    auth: {
      currentUser: {
        email: 'ai1@gmail.com' // Mock current user email
      }
    }
  }));
  
  jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ data: {} })), // Mock post method
    get: jest.fn(() => Promise.resolve({ data: {} })), // Mock get method
  }));


  jest.mock('firebase/firestore', () => ({
    addDoc: jest.fn(),
    deleteDoc: jest.fn(),
    doc: jest.fn(() => 'mockDocRef'),
    query: jest.fn(() => 'mockQuery'), // Mock return to indicate a query object
    where: jest.fn(() => 'mockWhere'), // Mock return to indicate a query condition
    getDocs: jest.fn().mockImplementation(() => {
        // Simulating the structure of a QuerySnapshot
        const docs = [
          { 
            id: '2', 
            data: () => ({ title: 'Spaghetti Carbonara', ingredients: 'pasta, eggs, bacon', user: 'ai1@gmail.com' })
          },
          { 
            id: '3', 
            data: () => ({ title: 'Penne Arrabbiata', ingredients: 'pasta, tomatoes, garlic', user: 'ai1@gmail.com' })
          }
        ].map(doc => ({
          id: doc.id,
          data: doc.data,
        }));
        return Promise.resolve({ docs }); // Note: wrapping the docs array in an object
      }),
    }));
  
  
  describe('DashboardModel', () => {
    let model;
  
    beforeEach(() => {
        model = new DashboardModel();
      });
    
      afterEach(() => {
        jest.clearAllMocks();
      });

      describe('fetchRecipes', () => {
        it('should fetch and populate recipes for a valid user', async () => {
          const mockUser = { email: 'ai1@gmail.com' };
    
          const fetchedRecipes = await model.fetchRecipes(mockUser);
    
          expect(fetchedRecipes).toEqual(expect.arrayContaining([
            expect.objectContaining({ title: 'Spaghetti Carbonara' }),
            expect.objectContaining({ title: 'Penne Arrabbiata' })
          ]));
          expect(fetchedRecipes.length).toBe(2);
        });
    
        it('should return an empty array when no user is provided', async () => {
          const fetchedRecipes = await model.fetchRecipes(null);
          expect(fetchedRecipes).toEqual([]);
        });
      });
    
      describe('searchRecipes', () => {
        describe('searchRecipes', () => {
            it('should return an empty array if search text does not match any recipes', async () => {
              const searchText = 'NonExistentRecipe';
              model.recipes = [
                { title: 'Spaghetti Carbonara', ingredients: 'pasta, eggs, bacon' },
                { title: 'Penne Arrabbiata', ingredients: 'pasta, tomatoes, garlic' },
                { title: 'Chicken Alfredo', ingredients: 'chicken, pasta, cream sauce' }
              ];
          
              const filteredRecipes = await model.searchRecipes(searchText);
          
              expect(filteredRecipes).toEqual([]);
            });
          });
          
        it('should return all recipes if search text is empty', async () => {
          const searchText = '';
          const mockRecipes = [
            { title: 'Spaghetti Carbonara', ingredients: 'pasta, eggs, bacon' },
            { title: 'Penne Arrabbiata', ingredients: 'pasta, tomatoes, garlic' },
            { title: 'Chicken Alfredo', ingredients: 'chicken, pasta, cream sauce' }
          ];
    
          model.recipes = mockRecipes;
    
          const filteredRecipes = await model.searchRecipes(searchText);
    
          expect(filteredRecipes).toEqual(mockRecipes);
        });
      });
      describe('searchRecipes', () => {
        it('should return filtered recipes matching the search text', async () => {
          const searchText = 'carbonara';
          model.recipes = [
            { title: 'Spaghetti Carbonara', ingredients: 'pasta, eggs, bacon' },
            { title: 'Penne Arrabbiata', ingredients: 'pasta, tomatoes, garlic' },
            { title: 'Chicken Alfredo', ingredients: 'chicken, pasta, cream sauce' }
          ];
      
          const filteredRecipes = await model.searchRecipes(searchText);
      
          expect(filteredRecipes).toEqual(expect.arrayContaining([
            expect.objectContaining({ title: 'Spaghetti Carbonara' })
          ]));
          expect(filteredRecipes.length).toBe(1);
        });
      });
      
      // Test for adding a new recipe
      describe('addNewRecipe', () => {
        it('should add a new recipe and reflect it in the recipes list', async () => {
          const newRecipeData = { title: 'New Recipe', ingredients: 'Some Ingredients' };
          const mockNewRecipeRef = { id: 'newRecipeId' }; // Mock Firestore document reference for the new recipe
          require('firebase/firestore').addDoc.mockResolvedValue(mockNewRecipeRef); // Ensure the mock is in the correct scope
      
          await model.addNewRecipe(newRecipeData);
      
          expect(model.recipes[0]).toMatchObject({ ...newRecipeData, id: mockNewRecipeRef.id });
          expect(model.recipes[0].id).toEqual(mockNewRecipeRef.id);
        });
      });
      
      // Test for deleting a recipe by ID
      describe('deleteRecipeById', () => {
        it('should remove a recipe by its ID from the recipes list', async () => {
          model.recipes = [
            { id: '1', title: 'Spaghetti Carbonara', ingredients: 'pasta, eggs, bacon' },
            { id: '2', title: 'Penne Arrabbiata', ingredients: 'pasta, tomatoes, garlic' }
          ];
          const recipeIdToDelete = '1';
      
          await model.deleteRecipeById(recipeIdToDelete);
      
          expect(model.recipes).toEqual(expect.not.arrayContaining([
            expect.objectContaining({ id: recipeIdToDelete })
          ]));
          expect(model.recipes.length).toBe(1);
        });
      });
      
      // Test the saveRecipe function for saving a new recipe
      describe('saveRecipe', () => {
        it('should save a new recipe if it does not already exist', async () => {
          const newRecipe = { title: 'Lasagna', ingredients: 'pasta, tomato sauce, beef, cheese' };
          require('firebase/firestore').getDocs.mockResolvedValueOnce({ empty: true }); // Simulate that the recipe does not exist
          const mockNewDocRef = { id: 'newDocId' };
          require('firebase/firestore').addDoc.mockResolvedValue(mockNewDocRef);
      
          const savedRecipeId = await model.saveRecipe(newRecipe);
      
          expect(savedRecipeId).toBe(mockNewDocRef.id); // Expect the new recipe ID to match the mocked doc ID
        });
      
        it('should throw an error if the recipe already exists', async () => {
          const existingRecipe = { title: 'Penne Arrabbiata', ingredients: 'pasta, tomatoes, garlic' };
          require('firebase/firestore').getDocs.mockResolvedValueOnce({ empty: false }); // Simulate that the recipe exists
      
          await expect(model.saveRecipe(existingRecipe)).rejects.toThrow('Recipe already saved!');
        });
      });
      
      // Test the regenerateRecipe function
      describe('regenerateRecipe', () => {
        it('should regenerate a recipe based on given input and return it', async () => {
          const recipeInput = { ingredients: 'chicken, pasta', cuisine: 'Italian', diet: '', allergy: '' };
          const regeneratedRecipe = { title: 'Chicken Pasta', ingredients: 'chicken, pasta', cuisine: 'Italian' };
          require('axios').post.mockResolvedValueOnce({ status: 200, data: regeneratedRecipe });
      
          const result = await model.regenerateRecipe(recipeInput);
      
          expect(result).toMatchObject(regeneratedRecipe);
        });
      
        it('should throw an error if the recipe cannot be regenerated', async () => {
          const recipeInput = { ingredients: 'chicken, pasta', cuisine: 'Italian', diet: '', allergy: '' };
          require('axios').post.mockResolvedValueOnce({ status: 200, data: { title: 'recipe cannot be generated' } });
      
          await expect(model.regenerateRecipe(recipeInput)).rejects.toThrow('Recipe cannot be regenerated with the given inputs');
        });
      });
  });
