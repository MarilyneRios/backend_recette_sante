import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password} = req.body;  
    console.log(`le username : ${username}, le email : ${email}, et le password : ${password}`);

    const userExists = await User.findOne({email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ username, email, password});

    if (user) {

     const token = generateToken(res, user._id);

      res.status(201).json({
        //_id: user._id, // Utiliser le token au lieu du _id
        token: token,
        username: user.username,  
        email: user.email, 
    });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
   // res.status(200).json({message: 'Register User'})
  });


// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public 
const authUser = asyncHandler (async(req, res) => {
   
   // res.status(401);
    //throw new Error('Invalid email or password');
   
    res.status(200).json({message: 'Auth User'})

});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    // Supprime le cookie

      res.status(200).json({ message: 'Logout user successfully' });
    };

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (token)
const getUserProfile = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'Get user profil successfully'});

});


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (token)
const updateUserProfile = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'Update user profil successfully'});
});



export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
};

