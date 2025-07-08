const authService= require('../services/authService')

const registerController= async(req,res)=>{
    const result= await authService.registerUser(req.body);
    res.status(result.status).send({
        message: result.message
    })
}

const loginController=async(req,res)=>{
    const result= await authService.loginUser(req.body);
    res.status(result.status).send({...result})
}

module.exports={
    registerController,
    loginController
}