
import express from 'express';
import {
    allRecipes,
    allRecipesAuth,
    OneRecipeAuth,
    NewRecipe,
    UpdateRecipe,
    DeleteRecipe,
    SearchRecipe,
    FilterRecipe
} from '../controllers/recipeController.js';

const router = express.Router();

router.get('/allRecipes', allRecipes);  // get : http://localhost:3001/api/recipes/allRecipes
router.get('/allRecipesAuth', allRecipesAuth); //get : http://localhost:3001/api/recipes/allRecipesAuth
router.get('/OneRecipeAuth', OneRecipeAuth); // get : http://localhost:3001/api/recipes/OneRecipeAuth
router.post('/NewRecipe', NewRecipe); //post : http://localhost:3001/api/recipes/NewRecipe
router.put('/UpdateRecipe', UpdateRecipe); // put: http://localhost:3001/api/recipes/UpdateRecipe
router.delete('/DeleteRecipe', DeleteRecipe); // delete : http://localhost:3001/api/recipes/DeleteRecipe
router.get('/SearchRecipe', SearchRecipe); // get: http://localhost:3001/api/recipes/SearchRecipe
router.get('/FilterRecipe', FilterRecipe); // get: http://localhost:3001/api/recipes/FilterRecipe

export default router; 
