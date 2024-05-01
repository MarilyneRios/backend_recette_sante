//generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  //stocke le token JWT dans un cookie HTTP
  res.cookie('jwt', token, {
    httpOnly: true,
     // Cette option force le cookie à être envoyé uniquement sur des connexions sécurisées
    secure: process.env.NODE_ENV !== 'development',// Utiliser secure cookies en production

    sameSite: 'strict', 
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
  return token;
};

export default generateToken;