import mongoose from 'mongoose';

const RecipeSchema = mongoose.Schema ({
    name : {type: String, require : true},
    category:{type: String},
    ingredients: [{type: String}],
    instructions: {type: String},
    makingTime: {type: Number},
    cookingTime: {type: Number},
    comments: {type: String},
    pseudo: {type: String},
    imageUrl: {type: String},
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require:true,
    }
})

const Recipe = mongoose.model('Recipes', RecipeSchema);

export default Recipe;
