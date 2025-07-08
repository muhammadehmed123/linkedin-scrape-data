//all routes will be gathered here
const userController = require('../controllers/userController');
const authValidator= require('../validators/authValidator');
const orderController = require('../controllers/orderController');

const authRoutes=[
    {
        url:'/orders',
        method:'GET',
        handler: orderController.getOrderController
    },
    {
        url:'/orderByProd/:id',
        method:'GET',
        handler: orderController.getOrderByProductController
    }
]

module.exports= authRoutes;