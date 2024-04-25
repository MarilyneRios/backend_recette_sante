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
    secure: process.env.NODE_ENV !== 'development',
    // Cette option empêche le navigateur d’envoyer le cookie lors de requêtes cross-site,
    // ce qui aide à prévenir les attaques de type cross-site request forgery (CSRF).
    sameSite: 'strict', 
    // Cette option définit la durée de vie du cookie à 30 jours.
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
  return token;
};

export default generateToken;