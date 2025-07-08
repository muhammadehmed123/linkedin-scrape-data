const authService= require('../services/authService')
const orderService = require('../services/orderService')

// "localhost:4000/order?id=1"
const getOrderController = async (req, res) => {
    const result = await orderService.getOrder(req.params.id);
    res.status(result.status).send({
        ...result
    })
}
const getOrderByProductController = async (req, res) => {
    const result = await orderService.getOrdersByProduct(req.params.id);
    res.status(result.status).send({
        ...result
    })
}

module.exports={
    getOrderController,
    getOrderByProductController,
    
}