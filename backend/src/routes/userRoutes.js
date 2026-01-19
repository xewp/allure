import express from 'express';
import { addFavorite, removeFavorite, getFavorites, getUserById, getAllUsers, deleteUser, updateUser, changePassword, requestPasswordReset, verifyResetToken, resetPassword } from '../controllers/userController.js';

const router = express.Router();

router.post('/favorites/add', addFavorite);
router.post('/favorites/remove', removeFavorite);
router.get('/:userId/favorites', getFavorites);

// User profile route
router.get('/:id', getUserById);

// Admin user management routes
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

// Password change route
router.put('/:id/change-password', changePassword);

// Password reset routes
router.post('/reset-password/request', requestPasswordReset);
router.post('/reset-password/verify', verifyResetToken);
router.post('/reset-password/reset', resetPassword);

export default router;
