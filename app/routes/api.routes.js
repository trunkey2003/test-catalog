var express = require('express');
var router = express.Router();

const productController = require('../controllers/product.controller');
const catalogController = require('../controllers/catalog.controller');

router.get('/catalog/:id', catalogController.getById);
router.post('/catalog', catalogController.create);

// router.get('/product/catalog/:catalogId', productController.getProductByCatalogId);
router.post('/product/catalog/:catalogId', productController.addProduct);
router.get('/product/:id', productController.getProduct);
router.put('/product/:id/activate', productController.makeProductActive);
router.put('/product/:id/inactivate', productController.makeProductInactive);


module.exports = router;
