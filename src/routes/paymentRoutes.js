//all routes will be gathered here
const userController = require('../controllers/userController');
const authValidator= require('../validators/authValidator');
const paymentController = require('../controllers/paymentController');

const paymentRoutes=[
    {
        url:'/payments',
        method:'GET',
        handler: paymentController.getPaymentController,
    },
]

module.exports= paymentRoutes;