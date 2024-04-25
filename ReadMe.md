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
////////////////////////////////////////////////////////////////////
    ps: faites votre dépot github avec le .env sans infos sensible
    Si le fichier .env apparait sur votre gitHub : 

     git rm --cached .env
     git commit -m "Remove .env from tracking"
     git push origin main

/////////////////////////////////////////////////////////////////////
Pour supprimer le fichier .env du premier commit sur gitHub:

git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all

/////////////////////////////////////////////////////////////////////
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

19/ Mongoose fonctionne avec des promesses, donc asynchrone :

il y a plusieurs façon de faire, ici je veux utiliser async Handler:
C'est une **bibliothèque** d’assistance pour gérer les exceptions dans les **fonctions asynchrones**
    (les exceptions non gérées dans les routes asynchrones seront automatiquement transmises à votre middleware d’erreur)
//////////////////////////////////////////
npm install **express-async-handler**
/////////////////////////////////////////

20/ mkdir middleware

21/ Créer un fichier : errorMiddleware.js

    const notFound = (req, res, next) => {
        const error = new Error(`Not Found - ${req.originalUrl}`);
        res.status(404);
        next(error);
    };
    
   
    const errorHandler = (err, req, res, next) => {
        let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        let message = err.message;
    
        if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 404;
        message = "Resource not found";
        }
    
        res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
        });
    };
    
    export { notFound, errorHandler };
////////////////////////////////////////////////////////////////////////
**Ajout** dans **server.js**:
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
 
(juste avant app.listen ) 
app.use(notFound);
app.use(errorHandler);
    
22/ mkdir config

23/ Créer un fichier : db.js

        import mongoose from 'mongoose';

        const connectDB = async () => {
        try {
            const conn = await mongoose.connect(process.env.VITE_DB_CONNECTION_STRING);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
        };

         export default connectDB;

24/ mkdir models

25/ Créer un fichier : userModel.js et recipeModel.js

26/ register (avec utilisation du token au lieu de _id)

////////////////////////////////////////////////////////////////////
            userModel.js
////////////////////////////////////////////////////////////////////
    import mongoose from 'mongoose';
    import bcrypt from 'bcryptjs';
    import uid2 from 'uid2'; 

    const UserSchema = mongoose.Schema(
    {
        username: {
        type: String,
        required: true,
        },

        email: {
        type: String,
        required: true,
        unique: true,
    
        },
        password: {
        type: String,
        required: true,
        },
        ////////////////////////////////////////////////////////////////////
        // Générer un token par défaut lors de la création de l'utilisateur
        token: {
            type: String,
            unique:true,
            default: function() {return uid2(32)}
        }
        ////////////////////////////////////////////////////////////////////
    },
    {
        timestamps: true,
    }
    );


    UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    });

    UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
    };

    const User = mongoose.model('User', UserSchema);

    export default User;

////////////////////////////////////////////////////////////////////////////////////////////////
            userController.js
////////////////////////////////////////////////////////////////////////////////////////////////
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
      res.status(201).json({
        //_id: user._id, // Utiliser le token au lieu du _id
        token: user.token,
        username: user.username,  
        email: user.email, 
    });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  });
////////////////////////////////////////////////////////////////////////////////////////////////

27/ mkdir utils puis touch generateToken.js

    import jwt from 'jsonwebtoken';

    const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    //stocke le token JWT dans un cookie HTTP
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict', 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    };

    export default generateToken;


28/ userController.js :

  const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
////////////////////////////////////////////////////////////////////////////////////
    const logoutUser = (req, res) => {

    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logout user successfully' });
  };


29/ server.js

import cookieParser from 'cookie-parser';
////////////////////////////////////////////////////////////////////////////////////
app.use(cookieParser());


30/ AuthMiddleware.js

    import jwt from 'jsonwebtoken';
    import asyncHandler from 'express-async-handler';
    import User from '../models/userModel.js';

    const protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');

        next();
        } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
    });

    export { protect };


31/ userRoutes ;

import { protect } from '../middleware/authMiddleware.js';

router
  .route('/profile')
 .get( protect, getUserProfile) //get: http://localhost:3001/api/users/profile
 .put( protect, updateUserProfile); //put: http://localhost:3001/api/users/profile


31/ userController.js:

    logique get profile et put profile

32/ recipeRoute.js 

import { protect } from '../middleware/AuthMiddleware.js';
////////////////////////////////////////////////////////////////////////////////////
ajout => protect pour les routes privées


33/ recipeController.js:

    const CreateRecipe  = asyncHandler(async (req, res) => {
    
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not signed in');
        }

        const recipe = await Recipe.create({ 
            name: req.body.name,
            category: req.body.category,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            makingTime: req.body.makingTime,
            cookingTime: req.body.cookingTime,
            comments: req.body.comments,
            pseudo: req.body.pseudo,
            imageUrl: req.body.imageUrl,
            userId: user._id, 
        });

        if (recipe) {

            const token = generateToken(res,user._id); 

            res.status(201).json({
                token,
                username: user.username,
                email: user.email,
                recipe, 
            });
    
        } else {
        res.status(400);
        throw new Error('Error creating recipe');
        }
    });

    les autres routes...


34/ quand vous avez ce message:

(node:13820) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 exit listeners added to [Bus]. Use emitter.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)

**Ajouter EventEmitter** dans **server.js**:
EventEmitter **facilite la communication** entre différents objets de votre application Node.js via des événements.

////////////////////////////////////////////////////////////////////////////////
    import { EventEmitter } from 'events';

    EventEmitter.defaultMaxListeners = 15;
////////////////////////////////////////////////////////////////////////////////
**Définit le nombre maximum d’écouteurs** qui peuvent être ajoutés à un EventEmitter avant que Node.js n’émette un avertissement. Par **défaut**, ce nombre est **10**

35/ preparation deployment:

a/ dans server.js ajouter:

import path from 'path'; 
const port = process.env.PORT || 3001;


if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
  } else {
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
  }

b/touch vercel.json
 
    {
        "version": 2,
        "builds": [{
        "src": "server.js",
        "use": "@vercel/node"
        }],
        "routes": [{
        "src": "/(.*)",
        "dest": "server.js"
        }]
    }

36/ site vercel

- connexion
- +add new > project
- choisir le dépôt git
- variable environnement


