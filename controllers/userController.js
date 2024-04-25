import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password} = req.body;  
    console.log(`le username : ${username}, le email : ${email}, et le password : ${password}`);

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      if (userExists.email === email) {
        res.status(400);
        throw new Error('Email already exists');
      }
      if (userExists.username === username) {
        res.status(400);
        throw new Error('Username already exists');
      }
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
   
    const { email, password } = req.body;

    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
        const token = generateToken(res, user._id);
  
      res.json({
       token: token,
       username: user.username,  
       email: user.email, 
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  //  res.status(200).json({message: 'Auth User'})

});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
     // Supprime le cookie
     res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({ message: 'Logout user successfully' });
    };

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (token)
const getUserProfile = asyncHandler(async (req, res) => {
   // res.status(200).json({message: 'Get user profil successfully'});
   console.log(req.user);

   const user = await User.findById(req.user._id);

   if (user) {
    const token = generateToken(res, user._id); 
     res.json({
        token: token,
        avatar:user.avatar,
       username: user.username,
       email: user.email,
     });

     res.status(200).json(user);
   } else {
     res.status(404);
     throw new Error('User not found');
   }
});


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (token)
const updateUserProfile = asyncHandler(async (req, res) => {
   // res.status(200).json({message: 'Update user profil successfully'});

   console.log(req.user); 

    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.avatar = req.body.avatar || user.avatar;
         // Si un mot de passe est donné, met à jour du password
        if (req.body.password) {
          user.password = req.body.password;
        }
    
         // Sauvegarder les modifications 
        const updatedUser = await user.save();
    
        // Renvoie une réponse JSON contenant les informations mises à jour
        res.json({
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
        });
      } else {
        res.status(404);
        throw new Error('User not found');
      }
    });

// @desc    delete user profile
// @route   DELETE /api/users/profile
// @access  Private (token)
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await User.deleteOne({ _id: req.user._id });
  res.json({ message: "User removed" });
});

    
    


export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};

