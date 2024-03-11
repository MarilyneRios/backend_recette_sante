
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

router.get('/allRecipes', allRecipes); 
router.get('/allRecipesAuth', allRecipesAuth); 
router.get('/OneRecipeAuth', OneRecipeAuth); 
router.post('/NewRecipe', NewRecipe); 
router.put('/UpdateRecipe', UpdateRecipe); 
router.delete('/DeleteRecipe', DeleteRecipe); 
router.get('/SearchRecipe', SearchRecipe); 
router.get('/FilterRecipe', FilterRecipe); 

export default router; 
