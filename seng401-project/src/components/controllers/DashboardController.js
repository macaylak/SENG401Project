    // DashboardController.js
    import DashboardModel from '../models/DashboardModel';

    class DashboardController {
    constructor(model) {
        this.model = model;
    }

    async getRecipes(user) {
        return await this.model.fetchRecipes(user);
    }

    async searchRecipes(searchText) {
        return await this.model.searchRecipes(searchText);
    }

    async addRecipe(recipeData) {
        return await this.model.addNewRecipe(recipeData);
    }

    async deleteRecipe(recipeId) {
        await this.model.deleteRecipeById(recipeId);
    }

    async saveRecipe(recipe) {
        return await this.model.saveRecipe(recipe);
    }
    
    async regenerateRecipe(recipeInput) {
        return await this.model.regenerateRecipe(recipeInput);
    }

    }

    export default DashboardController;