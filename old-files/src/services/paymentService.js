const Payment = require("../models/payment")


const getPayment = async (id) => {
    try{
        const response = id ? await Payment.findByPk(id) : await Payment.findAll();
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
module.exports = { getPayment }; 