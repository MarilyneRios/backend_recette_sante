import express from 'express';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';


dotenv.config();

connectDB();

const app = express(); 
const port = process.env.PORT;

//gérer les données JSON et URL encodées dans les requêtes entrantes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Le terme “api”  est une convention lors de la création d’APIs Web.
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

app.get('/', (req, res) => {
    res.send('Server is ready...');
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server Started on port ${port}`));


/*les routes : token remplace le id

- **POST /api/users** register un utilisateur
- **POST /api/users/auth** Authentifier un utilisateur et un token
- **POST /api/userslogout** déconnexion d'un utilisateur et nettoyer les cookies
- **GET /api/users/profile**  obtenir un profile utilisateur
- **PUT /api/users/profile** mise à jour d'un profil

- GET /api/recipes/allRecipes : Lire toutes les recettes partiellement (pour la page d’accueil)
- GET /api/recipes/auth : Lire toutes les recettes partiellement quand l’utilisateur est authentifié
- GET /api/recipes/:token  : Lire une recette complète quand l’utilisateur est authentifié
- POST /api/recipes : Ajouter une recette quand l’utilisateur est authentifié
- GET /api/recipes/search/:query : Rechercher des recettes avec une barre de recherche
- GET /api/recipes/category/:category : Filtrer les recettes par catégorie
- PUT /api/recipes/:token  : Mettre à jour une recette quand l’utilisateur est authentifié
- DELETE /api/recipes/:token  : Effacer une recette par le créateur

*/