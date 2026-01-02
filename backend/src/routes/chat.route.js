import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getFriendsWithChats, getStreamToken } from '../controller/chat.controller.js';
const router = express.Router();
router.get('/token',protectRoute,getStreamToken);
router.get('/friends-with-chats',protectRoute,getFriendsWithChats);

export default router;
