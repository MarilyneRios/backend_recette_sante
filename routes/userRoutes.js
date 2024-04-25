import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/', registerUser); //post: http://localhost:3001/api/users/
router.post('/auth', authUser); //post: http://localhost:3001/api/users/auth
router.post('/logout', logoutUser); //post: http://localhost:3001/api/users/logout

router
  .route('/profile')
 .get( protect, getUserProfile) //get: http://localhost:3001/api/users/profile
 .put( protect, updateUserProfile) //put: http://localhost:3001/api/users/profile
 .delete(protect, deleteUserProfile); //delete: http://localhost:3001/api/users/profile

export default router;