import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

import Recipe from "../models/recipeModel.js";
import User from "../models/userModel.js";

// @desc    recipes & diplay one recipe on homeScreen && sigIn
// @route   GET /api/recipes/:id
// @access  Private (token)
const viewRecipeAuth = asyncHandler(async (req, res) => {
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
          _id: recipe._id,
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
// @route   GET /api/recipes/:id
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
          _id: recipe._id,
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
// @route   PUT /api/recipes/:id
// @access  Private (token)
const UpdateRecipe = asyncHandler(async (req, res) => {
  
  //Si user connecté
  console.log(req.user); 
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not signed in");
  }
  // modifier recipe
  const recipe = await Recipe.findById(req.params.id); 
  console.log(recipe); 

  if(recipe){

    // Vérifier si la recette a une propriété 'user'
  if (!recipe.userId) {
    res.status(404);
    throw new Error("The recipe hasn't 'user'");
  }

  // Vérifier si l'utilisateur = créateur de la recette
  if (recipe.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Can't update this recipe it's not the owner");
  }
  
    // Trouver la recette et modifier
    recipe.name = req.body.name || recipe.name;
    if(req.body.category) recipe.category = req.body.category;
    if(req.body.ingredients) recipe.ingredients = req.body.ingredients;
    if(req.body.instructions) recipe.instructions = req.body.instructions;
    if(req.body.makingTime) recipe.makingTime = req.body.makingTime;
    if(req.body.cookingTime) recipe.cookingTime = req.body.cookingTime;
    if(req.body.comments) recipe.comments = req.body.comments;
    if(req.body.pseudo) recipe.pseudo = req.body.pseudo;
    if(req.body.imageUrl) recipe.imageUrl = req.body.imageUrl;

    
    // Sauvegarder les modifications   
    const updatedRecipe = await recipe.save();

    // Renvoie une réponse JSON contenant les informations mises à jou
    res.json({
      _id: updatedRecipe._id,
      name: updatedRecipe.name,
      category: updatedRecipe.category,
      ingredients: updatedRecipe.ingredients,
      instructions: updatedRecipe.instructions,
      makingTime: updatedRecipe.makingTime,
      cookingTime: updatedRecipe.cookingTime,
      comments: updatedRecipe.comments,
      pseudo: updatedRecipe.pseudo,
      imageUrl: updatedRecipe.imageUrl,
      message: "Recipe updated"
    });
    
    } else {
      res.status(404);
      throw new Error("Recipe not found");
    }
 // res.status(200).json({ message: "Update recipe successfuly" });
});

// @desc    Delete one recipe && sigIn
// @route   DELETE /api/recipes/:id
// @access  Private (token)
const DeleteRecipe = asyncHandler(async (req, res) => {
   
  // 1) Si user connecté
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not signed in");
    }

    // 2) trouver la recipe avec params.id
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if(recipe){

      // 3) Vérifier si la recette a une propriété 'user'
      if (!recipe.userId) {
        res.status(404);
        throw new Error("The recipe hasn't 'user'");
      }
    
      // 4) Vérifier si l'utilisateur = créateur de la recette
      if (recipe.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("Can't delete this recipe it's not the owner");
      }
      // 5) Supprimer la recette
      await Recipe.findByIdAndDelete(req.params.id);
      res.json({ message: "Recipe removed" });

    } else {
      res.status(404);
      throw new Error("Recipe not delete");
    }
 // res.status(200).json({ message: "Delete recipe successfuly" });
});

// @desc    Search recipes & diplay one recipe on homeScreen
// @route   GET /api/recipes/search/:query
// @access  Public
const SearchRecipe = asyncHandler(async (req, res) => {
  const query = req.params.query;
  try {
    const recipes = await Recipe.find({ name: { $regex: query, $options: 'i' } });
    res.status(200).json(recipes);
    console.log(recipes);
  } catch (error) {
    res.status(500).json(error);
  }
  //res.status(200).json({ message: " Search one recipe successfuly" });
});

// @desc    Filter recipes by category & diplay one recipe on homeScreen
// @route   GET /api/recipes/category/:category
// @access  Public
const FilterRecipe = asyncHandler(async (req, res) => {
  const category = req.params.category;
  console.log(`Category: ${category}`);
  try {
    const recipes = await Recipe.find({ category: { $regex: category, $options: 'i' }});
    console.log(`Found ${recipes.length} recipes`); 
    res.status(200).json(recipes);
  } catch (error) {
    console.error(`Error: ${error}`); 
    res.status(500).json(error);
  }
  //res.status(200).json({ message: " Filter recipes by category successfuly" });
});

// @desc    Diplay favorite recipes by user on homeScreen
// @route   GET /api/recipes/allRecipesFavorite
// @access  Private
const allRecipesFavorite = asyncHandler(async (req, res) => {
  //Si user connecté
  console.log(req.user); 
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not signed in");
  }
 
  // Rechercher les savedRecipes par user
  const savedRecipes = await Recipe.find({
    '_id': { $in: user.savedRecipes }
  });

  if (savedRecipes) {
    return res.json(savedRecipes);
  } else {
    res.status(404);
    throw new Error("No favorite recipes found");
  }
 // res.status(200).json({ message: " diplay favorite recipes by user successfuly" });
});

// @desc    Display 1 recipe of favorite recipes by user on homeScreen
// @route   GET /api/recipes/oneRecipesFavorite/:id
// @access  Private
const oneRecipesFavorite = asyncHandler(async (req, res) => {
  console.log(req.user); 
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not signed in");
  }
 
  // Rechercher 1 savedRecipe par user
  const savedRecipes = await Recipe.findOne({
    '_id': { $in: user.savedRecipes }
  });

  if (savedRecipes) {
    return res.json(savedRecipes);
  } else {
    res.status(404);
    throw new Error("No favorite recipes found");
  }
});

// @desc    Add 1 recipe to favorite recipes by user on homeScreen
// @route   POST /api/recipes/addRecipeFavorite
// @access  Private
const addRecipeFavorite  = asyncHandler(async (req, res) => {
  
  //Si user connecté
  console.log(req.user); 
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not signed in");
  }
  // modifier recipe
  const recipe = await Recipe.findById(req.params.id);
  console.log(recipe); 

   //pousser la recette et sauvegarder
   try {
     user.savedRecipes.push(recipe);
     await user.save();
     return res.json({ savedRecipes: user.savedRecipes });
   } catch (error) {
     return res.json(error);
   }
  // res.status(200).json({ message: "Add 1 recipe to favorites by user successfully" });
});

// @desc    Remove 1 recipe from favorite recipes by user on homeScreen
// @route   DELETE /api/recipes/removeRecipeFavorite/:id
// @access  Private
const removeRecipeFavorite = asyncHandler(async (req, res) => {
   //Si user connecté
   console.log(req.user); 
   const user = await User.findById(req.user._id);
 
   if (!user) {
     res.status(404);
     throw new Error("User not signed in");
   }
   // modifier recipe
   const recipe = await Recipe.findById(req.params.id);
   console.log(recipe); 

    //Retirer recipe from favorite recipes et non supprimer de la base de données
    // => .indexOf(req.params.id); au lieu de findByIdAndDelete()

    // 1)  trouver l'index dans le tableau savedRecipes
    const index = user.savedRecipes.indexOf(req.params.id);
   //une valeur  > -1 => l’élément a été trouvé dans le tableau (tableau commence à 0)
    if (index > -1) {
      // 2) supprimer l’élément à cet index du tableau => .splice(index, 1)
      user.savedRecipes.splice(index, 1);

      // 3) sauvegarder la modification
      await user.save();
      res.json({ message: "Recipe removed from favorite recipes" });
    } else {
      res.status(404);
      throw new Error("Recipe not found in favorite recipes");
    }
 });
 


export {
  viewRecipeAuth,
  allRecipesAuth,
  OneRecipeAuth,
  CreateRecipe,
  UpdateRecipe,
  DeleteRecipe,
  SearchRecipe,
  FilterRecipe,
  allRecipesFavorite,
  oneRecipesFavorite,
  addRecipeFavorite,
  removeRecipeFavorite,
};
