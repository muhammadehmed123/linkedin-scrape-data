const authService= require('../services/authService')
const paymentService = require('../services/paymentService')

// "localhost:4000/order?id=1"
const getPaymentController = async (req, res) => {
    const result = await paymentService.getPayment(req.params.id);
    res.status(result.status).send({
        ...result
    })
}

module.exports={
    getPaymentController,
}