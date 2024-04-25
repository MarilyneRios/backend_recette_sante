import mongoose from 'mongoose';

const RecipeSchema = mongoose.Schema ({
    name : {type: String, require : true},
    country:{type: String},
    category:{type: String},
    regime:{type: String},
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

// Create the text index
RecipeSchema.index({
    name: 'text',
    country: 'text',
    category:'text',
    regime: 'text',
    ingredients: 'text',
    comments: 'text',
    pseudo: 'text',
});

const Recipe = mongoose.model('Recipes', RecipeSchema);

export default Recipe;
