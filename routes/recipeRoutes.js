
import express from 'express';
import {
    allRecipes,
    allRecipesAuth,
    OneRecipeAuth,
    CreateRecipe,
    UpdateRecipe,
    DeleteRecipe,
    SearchRecipe,
    FilterRecipe
} from '../controllers/recipeController.js';
import { protect } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/allRecipes', allRecipes);  // get : http://localhost:3001/api/recipes/allRecipes
router.get('/allRecipesAuth',protect, allRecipesAuth); //get : http://localhost:3001/api/recipes/allRecipesAuth
router.get('/oneRecipeAuth/:id',protect, OneRecipeAuth); // get : http://localhost:3001/api/recipes/oneRecipeAuth/idRecipe
router.post('/createRecipe',protect, CreateRecipe); //post : http://localhost:3001/api/recipes/CreateRecipe
router.put('/UpdateRecipe/:id',protect, UpdateRecipe); // put: http://localhost:3001/api/recipes/UpdateRecipe/idRecipe
router.delete('/DeleteRecipe/:id',protect, DeleteRecipe); // delete : http://localhost:3001/api/recipes/DeleteRecipe/idRecipe
router.get('/SearchRecipe', SearchRecipe); // get: http://localhost:3001/api/recipes/SearchRecipe
router.get('/FilterRecipe', FilterRecipe); // get: http://localhost:3001/api/recipes/FilterRecipe

export default router; 
