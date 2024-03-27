import DashboardController from './DashboardController';
import DashboardModel from '../models/DashboardModel';
import { colRef, auth } from '../../firebase';


jest.mock('../../firebase', () => ({
    colRef: jest.fn(),
    auth: {
      currentUser: {
        email: 'test@example.com' // Mock current user email
      }
    }
  }));
  
  jest.mock('axios');
  jest.mock('firebase/firestore', () => ({
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn().mockResolvedValue({
      docs: [{ id: '1', data: () => ({ title: 'Recipe 1', user: 'test@example.com' }) }],
    }),
  }));
  
  // Mock `colRef` if it's not a direct function from Firestore that you can import and mock
  jest.mock('../../firebase', () => ({
    colRef: jest.fn().mockReturnValue({}),
    auth: {
      currentUser: {
        email: 'test@example.com' // Mock current user email
      }
    }
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
          const mockUser = { email: 'test@example.com' };
          const mockRecipes = [
            { id: '1', title: 'Spaghetti Carbonara', ingredients: 'pasta, eggs, bacon', user: mockUser.email },
            { id: '2', title: 'Penne Arrabbiata', ingredients: 'pasta, tomatoes, garlic', user: mockUser.email }
          ];

          // Mocking getDocs to simulate fetching recipes from Firestore
          const mockGetDocs = jest.fn().mockResolvedValue({
            docs: mockRecipes.map(recipe => ({
              id: recipe.id,
              data: () => recipe
            }))
          });
    
          colRef.mockReturnValue({
            where: jest.fn().mockReturnValue({
              getDocs: mockGetDocs
            })
          });
    
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
      describe('addNewRecipe', () => {
        it('should add a new recipe and return it', async () => {
          const recipeData = { title: 'Newest Recipe', ingredients: 'Some Ingredients' };
          const mockResponse = { id: '3', ...recipeData };
      
          // Mock addDoc to simulate adding a recipe
          require('firebase/firestore').addDoc = jest.fn().mockResolvedValue(mockResponse);
      
          const response = await model.addNewRecipe(recipeData);
      
          expect(response).toEqual(mockResponse);
          expect(model.recipes[0]).toEqual(mockResponse); // Assuming the recipe is added to the start of the array
        });
      });

      describe('deleteRecipeById', () => {
        it('should delete a recipe by id and update the local recipes array', async () => {
          const initialRecipes = [
            { id: '1', title: 'Recipe 1' },
            { id: '2', title: 'Recipe 2' }
          ];
          model.recipes = [...initialRecipes];
      
          // Mock deleteDoc to simulate successful deletion
          require('firebase/firestore').deleteDoc = jest.fn().mockResolvedValue({});
      
          await model.deleteRecipeById('1');
      
          expect(model.recipes).toEqual(expect.arrayContaining([initialRecipes[1]]));
          expect(model.recipes.length).toBe(1);
        });
      });
  });