const Order = require("../models/order");
const Product = require('../models/models');


const getOrder = async (id) => {
    try{
        const response = id ? await Order.findByPk(id) : await Order.findAll();
        return {
            status: 200,
            data: response,
        }
    }catch(err){
        console.error(err);
        return {
            status: 500,
            message: `Server Error: ${err}`,
        }
    }
    
} 
const getOrdersByProduct = async (productId) => {
    try{
        const response = await Order.findAll({
            include:[{
                model: Product,
                where: {product_id: productId},
            }]
        });
        return {
            status: 200,
            data: response,
        }
    }catch(err){
        console.error(err);
        return {
            status: 500,
            message: `Server Error: ${err}`,
        }
    }
}
module.exports = { 
    getOrder,
    getOrdersByProduct,
 }; 