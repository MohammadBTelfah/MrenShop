const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Upload config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', auth, userController.getProfile);
router.post('/change-password', auth, userController.changePassword);
router.get('/getallusers',  userController.getAllUsers); // Get all users

module.exports = router;
