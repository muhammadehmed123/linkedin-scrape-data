//all routes will be gathered here
const testRoute = require('./testRoutes');
const authRoutes = require('./authRoutes')
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require('./paymentRoutes');
const routes=[
    ...authRoutes,
    ...testRoute,
    ...orderRoutes,
    ...paymentRoutes,
]

module.exports= routes;