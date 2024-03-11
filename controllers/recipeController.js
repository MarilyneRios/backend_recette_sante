
// @desc    recipes & diplay on homeScreen
// @route   GET /api/recipes 
// @access  Public 
const allRecipes =  (req, res) => {
    res.status(200).json({message: 'All recipes'})
}

export {
    allRecipes,
    
};