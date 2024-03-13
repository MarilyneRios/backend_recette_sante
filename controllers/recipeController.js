import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

import Recipe from "../models/recipeModel.js";
import User from "../models/userModel.js";

// @desc    recipes & diplay on homeScreen
// @route   GET /api/recipes
// @access  Public
const allRecipes = asyncHandler(async (req, res) => {
  Recipe.find()
    .then((recipes) => {
      return res.json(recipes);
    })
    .catch((error) => console.log(error));

  //res.status(200).json({ message: "All recipes" });
});

// @desc    recipes & diplay on homeScreen && sigIn
// @route   GET /api/recipes/auth
// @access  Private (token)
const allRecipesAuth = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not signed in");
  }
  Recipe.find()
    .then((recipes) => {
      return res.json(recipes);
    })
    .catch((error) => console.log(error));

  //res.status(200).json({ message: "Display all recipes when sigIn" });
});

// @desc    recipes & diplay one recipe on homeScreen && sigIn
// @route   GET /api/recipes/:token
// @access  Private (token)
const OneRecipeAuth = asyncHandler(async (req, res) => {
  //Si user connecté
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not signed in");
  }

  //Rechercher recipe by id
  const id = req.params.id;

  Recipe.findById( id )
  .then((recipe) => {
    console.log(recipe);
      if (recipe) {
        return res.json({
          name: recipe.name,
          category: recipe.category,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          makingTime: recipe.makingTime,
          cookingTime: recipe.cookingTime,
          comments: recipe.comments,
          pseudo: recipe.pseudo,
          imageUrl: recipe.imageUrl,
        });
      } else {
        res.status(404);
        throw new Error("Recipe not found");
      }
    })
    .catch((error) => res.json(error));
  //res.status(200).json({ message: " Display one recipe when sigIn" });
});

// @desc    create one recipe && sigIn
// @route   POST /api/recipes
// @access  Private (token)
const CreateRecipe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not signed in");
  }

  const recipe = await Recipe.create({
    name: req.body.name,
    category: req.body.category,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    makingTime: req.body.makingTime,
    cookingTime: req.body.cookingTime,
    comments: req.body.comments,
    pseudo: req.body.pseudo,
    imageUrl: req.body.imageUrl,
    userId: user._id,
  });

  if (recipe) {
    const token = generateToken(res, user._id);

    res.status(201).json({
      token,
      username: user.username,
      email: user.email,
      recipe,
    });
  } else {
    res.status(400);
    throw new Error("Error creating recipe");
  }
  // res.status(200).json({message: 'New recipe created'})
});

// @desc    Update one recipe && sigIn
// @route   PUT /api/recipes/:token
// @access  Private (token)
const UpdateRecipe = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Update recipe successfuly" });
});

// @desc    Delete one recipe && sigIn
// @route   DELETE /api/recipes/:token
// @access  Private (token)
const DeleteRecipe = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Delete recipe successfuly" });
});

// @desc    Search recipes & diplay one recipe on homeScreen
// @route   GET /api/recipes/search/:query
// @access  Public
const SearchRecipe = asyncHandler(async (req, res) => {
  res.status(200).json({ message: " Search one recipe successfuly" });
});

// @desc    Filter recipes by category & diplay one recipe on homeScreen
// @route   GET /api/recipes/category/:category
// @access  Public
const FilterRecipe = asyncHandler(async (req, res) => {
  res.status(200).json({ message: " Filter recipes by category successfuly" });
});

export {
  allRecipes,
  allRecipesAuth,
  OneRecipeAuth,
  CreateRecipe,
  UpdateRecipe,
  DeleteRecipe,
  SearchRecipe,
  FilterRecipe,
};
