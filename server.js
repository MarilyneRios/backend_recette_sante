//server.js
import express from 'express';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { EventEmitter } from 'events';
import path from 'path'; 
import cors from 'cors';//

EventEmitter.defaultMaxListeners = 15;

import userRoutes from './routes/userRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';

dotenv.config();

connectDB();

const app = express(); 
const port = process.env.PORT || 3001;

const devOrigin = ['http://localhost:3000'];
const allowedOrigins = getEnvironmentVariable('NODE_ENV') === 'production' ? prodOrigins : devOrigin;

app.use(
  cors({
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === 'production') {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`${origin} not allowed by cors`));
        }
      } else {
        callback(null, true);
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);


/*
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials:true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));*/

//gérer les données JSON et URL encodées dans les requêtes entrantes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Le terme “api”  est une convention lors de la création d’APIs Web.
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
/*
app.get('/', (req, res) => { res.send('Server is ready...');});*/

app.get("/", (req, res) => { res.send("Express on Vercel"); }); 


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server Started on port ${port}`));
