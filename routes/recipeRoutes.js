/*
import express from 'express';
import {
    recipes,
} from '../controllers/recipeController.js';

const router = express.Router();

router.get('/recipes', recipes);

export default router;*/
import express from 'express';
import {
    allRecipes,
} from '../controllers/recipeController.js';

const router = express.Router();

router.get('/allRecipes', allRecipes); // Change this line

export default router; 
