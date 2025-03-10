//all routes will be gathered here
const userController = require('../controllers/userController');
const { signupSchema, loginSchema } = require('../schema/authSchema');
const authValidator= require('../validators/authValidator')

const authRoutes=[
    {
        url:'/register',
        method:'POST',
        schema: signupSchema,
        handler: userController.registerController,
        preHandler: authValidator.registerValidator,
    },
    {
        url:'/login',
        method:'POST',
        loginSchema,
        handler: userController.loginController,
        preHandler: authValidator.loginValidator
    }
]

module.exports= authRoutes;