import express from 'express';

import { getPosts, getPost, createPost, likePost, deletePost } from '../controllers/posts.js';

const router = express.Router();
import auth from "../middleware/auth.js";

router.get('/', getPosts);
router.post('/',auth,  createPost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router;