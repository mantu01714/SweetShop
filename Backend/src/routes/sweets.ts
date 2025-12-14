import { Router } from 'express';
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} from '../controllers/sweetController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateSweet, validateSweetUpdate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Public routes (authenticated users)
router.get('/', getAllSweets);
router.get('/search', searchSweets);
router.post('/:id/purchase', purchaseSweet);

// Admin only routes
router.post('/', requireAdmin, validateSweet, createSweet);
router.put('/:id', requireAdmin, validateSweetUpdate, updateSweet);
router.delete('/:id', requireAdmin, deleteSweet);
router.post('/:id/restock', requireAdmin, restockSweet);

export default router;