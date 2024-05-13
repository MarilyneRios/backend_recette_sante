//AuthMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// protect = middleware qui vérifie si un user est authentifié,
const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
        // Vérifie le token avec la clé secrète
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Recherche user dans la data base
      req.user = await User.findById(decoded.userId).select('-password');

      // Passe au middleware suivant
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('ErrorMiddlewae : Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };
