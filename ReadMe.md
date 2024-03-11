# process création backend
1/ mkdir backend

2/ cd backend

3/ npm init -y

4/ npm i express dotenv mongoose bcryptjs jsonwebtoken cookie-parser

5/ touch server.js

6/ Dans package.json :
    "type": "module", (utilise import au lieu de require)/////////

7/ Dans server.js:
    import express from 'express';
    const port= 3001;

    const app = express();

    app.get('/', (req, res) => {
        res.send('Server is ready...');
    });

    app.listen(port, () => console.log(`Server Started on port ${port}`));

8/  Dans package.json :
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon server.js",
    "server": "nodemon server.js"
  },

  + npm install -g nodemon ( pour l’utiliser dans tous vos projets) 
  ou
  npm install  nodemon ( localement dans le projet )

9/ pour lancer le server : **nodemon server.js**

10/ touch .env :
     NODE_ENV=development
    PORT=numéroDuPortUtilisé

    VITE_DB_CONNECTION_STRING=
    JWT_SECRET=

11/ Dans server.js:
    const port = process.env.PORT;

12/ Créer le fichier : **.gitignore**

    node_modules
    .env

12/ mkdir routes

13/ touch userRoutes.js recipeRoutes.js

14/ mkdir controllers (logique des routes : req HTTP)

15/ touch userController.js recipeController.js

16/ **ex : userController.js:** 
    // @desc    Auth user & get token
    // @route   POST /api/users/auth
    // @access  Public 
    const authUser =  (req, res) => {
        res.status(200).json({message: 'Auth User'})
    }

    export { authUser };

   **ex : userRoutes.js:**
    import express from 'express';
    import {
    authUser,
    } from '../controllers/userController.js';

    const router = express.Router();

    router.post('/auth', authUser);

    export default router;

17/ server.js:

import express from 'express';
import dotenv from 'dotenv';
**import userRoutes from './routes/userRoutes.js';**
**import recipeRoutes from './routes/recipeRoutes.js';**

dotenv.config();
const app = express(); 
const port = process.env.PORT;

// Le terme “api”  est une convention lors de la création d’APIs Web.
**app.use('/api/users', userRoutes);**
**app.use('/api/recipes', recipeRoutes);**

app.get('/', (req, res) => {
    res.send('Server is ready...');
});

app.listen(port, () => console.log(`Server Started on port ${port}`));

18/ Tester avec thunder client les routes
Post + http://localhost:3001/api/users/auth
Get + http://localhost:3001/api/recipes# backend_recette_sante
