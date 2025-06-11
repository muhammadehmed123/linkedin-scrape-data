//all routes will be gathered here
// const testRoute = require('./testRoutes');
// const authRoutes = require('./authRoutes')
// const orderRoutes = require("./orderRoutes");
// const paymentRoutes = require('./paymentRoutes');
const jobScraperRoutes= require('./jobScraperRoute');

const routes=[
    // ...authRoutes,
    // ...testRoute,
    // ...orderRoutes,
    // ...paymentRoutes,
    ...jobScraperRoutes
]

module.exports= routes;