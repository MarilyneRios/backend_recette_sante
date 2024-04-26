//server.js
import express from 'express';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { EventEmitter } from 'events';
import path from 'path'; 
import cors from 'cors';

EventEmitter.defaultMaxListeners = 15;

import userRoutes from './routes/userRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';

dotenv.config();
connectDB();

const app = express(); 
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3001;

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

//gérer les données JSON et URL encodées dans les requêtes entinstallrantes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Le terme “api”  est une convention lors de la création d’APIs Web.
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

//msg sur vercel
app.get("/", (req, res) => { res.send("Server is ready..."); }); 

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server Started on port ${port}`));

