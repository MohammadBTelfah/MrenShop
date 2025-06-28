const express = require('express');
const router = express.Router();
const productsController = require('../controllers/ProductsController');
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
router.get('/getallproduct', productsController.getAllProducts);
router.get('/getallproduct/:id', productsController.getProductById);
router.post('/createproduct', Adminauth, upload.single('image'), productsController.createProduct);
router.put('/updateProduct/:id', Adminauth, upload.single('image'), productsController.updateProduct);
router.delete('/deleteProduct/:id', Adminauth, productsController.deleteProduct);

module.exports = router;