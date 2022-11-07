const Catalog = require('../models/catalog.model');
const Product = require('../models/product.model');
const respond = require('../services/respond.service');

class catalogController {
    getById(req, res){
        const {id} = req.params;
        if (!id) return respond.error(res, 404, {message: 'Invalid catalog id'});
        Catalog.findById(id).then((catalog) => {
            if (catalog) {
                const catalogId = catalog._id;
                const catalogCopy = {...catalog._doc};
                Product.find({ catalogId })
                    .then((products) => {
                        respond.success(res, 200, {...catalogCopy, products});
                    })
                    .catch((err) => {
                        console.log(err);
                        respond.error(res, 500, err);
                    })
            } else respond.error(res, 404, {message: 'Catalog not found'});
        })
        .catch((err) => {
            respond.error(res, 500, err);
        })
    }

    create(req, res) {
        const {name, description} = req.body;
        const catalog = new Catalog({name, description});
        catalog.save().then((savedCatalog) => {
            respond.success(res, 200, {id: savedCatalog._id});
        })
        .catch((err) => {
            respond.error(res, 500, err);
        });
    }
};

module.exports = new catalogController;
