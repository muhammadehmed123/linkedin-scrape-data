//all routes will be gathered here
const userController = require('../controllers/userController')
const authValidator= require('../validators/authValidator')

const authRoutes=[
    {
        url:'/register',
        method:'POST',
        handler: userController.registerController,
        preHandler: authValidator.registerValidator,
    },
    {
        url:'/login',
        method:'POST',
        handler: userController.loginController,
        preHandler: authValidator.loginValidator
    }
]

module.exports= authRoutes;