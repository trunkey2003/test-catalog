const Product = require('../models/product.model');
const respond = require('../services/respond.service');

class productController {
    getProduct(req, res, next){
        const {id} = req.params;
        if (!id) return respond.error(res, 400, {message: 'Invalid product id'});
        Product.findById(id).then((product) => {
            if (product) respond.success(res, 200, product); else respond.error(res, 404, {message: 'Product not found'});
        })
        .catch((err) => {
            respond.error(res, 500, err);
        })
    }

    addProduct(req, res, next) {
        const { catalogId } = req.params;
        if (!catalogId) return respond.error(res, 400, { message: 'Invalid catalog id' });
        const { name, price, cost, description, images, unit, weightPerUnit } = req.body;
        if (!name || isNaN(Number(price)) || isNaN(Number(cost))) return respond.error(res, 400, { message: 'Invalid product data' });
        const product = new Product({ catalogId, name, price, cost, description, images, unit, weightPerUnit });
        product.save()
            .then((savedProduct) => {
                respond.success(res, 200, savedProduct);
            })
            .catch((err) => {
                respond.error(res, 500, err);
            })
    }
    
    makeProductActive(req, res, next) {
        const { id } = req.params;
        if (!id) return respond.error(res, 400, { message: 'Invalid product id' });
        Product.findByIdAndUpdate(id, { active: true })
            .then((product) => {
                if (product) respond.success(res, 200, {id: product._id}); else respond.error(res, 404, {message: 'Product not found'});
            })
            .catch((err) => {
                respond.error(res, 500, err);
            });
    }

    makeProductInactive(req, res, next) {
        const { id } = req.params;
        if (!id) return respond.error(res, 400, { message: 'Invalid product id' });
        Product.findByIdAndUpdate(id, { active: false })
            .then((product) => {
                if (product) respond.success(res, 200, {id: product._id}); else respond.error(res, 404, {message: 'Product not found'});
            })
            .catch((err) => {
                respond.error(res, 500, err);
            });
    }
};

module.exports = new productController;
