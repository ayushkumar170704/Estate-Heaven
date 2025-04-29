const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Protected routes
router.post('/', authMiddleware, upload.single('image'), createProperty);
router.put('/:id', authMiddleware, upload.single('image'), updateProperty);
router.delete('/:id', authMiddleware, deleteProperty);

module.exports = router;
