import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', registerUser); //post: http://localhost:3001/api/users/
router.post('/auth', authUser); //post: http://localhost:3001/api/users/auth
router.post('/logout', logoutUser); //post: http://localhost:3001/api/users/logout

router
  .route('/profile')
 .get( getUserProfile) //get: http://localhost:3001/api/users/profile
 .put( updateUserProfile); //put: http://localhost:3001/api/users/profile
export default router;