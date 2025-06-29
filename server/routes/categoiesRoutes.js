const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesControllers');
const Adminauth = require('../middleware/adminAuth');
const multer = require('multer');
// Upload config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });
// Routes
router.get('/getallcategories', categoriesController.getAllCategories);
router.get('/getallcategories/:id', categoriesController.getCategoryById);
router.post('/createcategory', Adminauth, upload.single('image'), categoriesController.createCategory);
router.put('/updateCategory/:id', Adminauth, upload.single('image'), categoriesController.updateCategory);
router.delete('/deleteCategory/:id', Adminauth, categoriesController.deleteCategory);
router.get('/getCategoryByName/:name', categoriesController.getCategoryByName);

module.exports = router;