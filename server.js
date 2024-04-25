//server.js
import express from 'express';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { EventEmitter } from 'events';
import path from 'path'; 

EventEmitter.defaultMaxListeners = 15;

import userRoutes from './routes/userRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';


dotenv.config();

connectDB();

const app = express(); 
const port = process.env.PORT || 3001;

//gérer les données JSON et URL encodées dans les requêtes entrantes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Le terme “api”  est une convention lors de la création d’APIs Web.
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
/*
app.get('/', (req, res) => {
    res.send('Server is ready...');
});*/

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

//app.get("/", (req, res) => { res.send("Express on Vercel"); }); 


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server Started on port ${port}`));
