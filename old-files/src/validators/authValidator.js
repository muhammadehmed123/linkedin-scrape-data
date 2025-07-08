const Joi = require("joi");

const registerValidatorSchema= Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
    gender: Joi.string().allow('male','female').required(),
    user_role: Joi.string().allow('customer','supplier','admin').required(),
    phone: Joi.string().required(),
})

const loginValidatorSchema= Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    user_role: Joi.string().allow('customer','supplier','admin').required(),
})

const registerValidator= (req,res,done)=>{
    try{
        const {error}= registerValidatorSchema.validate(req.body);
        if(error){
            return res.status(400).send(error.details);
        }
        done();
    }catch(error){
        console.error("validators->authValidator.js->registerValidator");
        console.log(err)
    }
}

const loginValidator= (req,res,done)=>{
    try{
        const {error}= loginValidatorSchema.validate(req.body);
        if(error){
            return res.status(400).send(error.details);
        }
        done();
    }catch(error){
        console.error("validators->authValidator.js->loginValidator");
        console.log(err)
    }
}

module.exports={
    registerValidator,
    loginValidator
}

