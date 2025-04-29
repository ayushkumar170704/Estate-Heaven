const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

router.get('/', getProperties);
router.get('/:id', getProperty);
router.post('/', auth, upload.single('image'), createProperty);
router.put('/:id', auth, upload.single('image'), updateProperty);
router.delete('/:id', auth, deleteProperty);

module.exports = router;
