const {sequelize} = require('../../config/pgSqlConfig')
const  {Product} = require('../models/models');

sequelize.options.logging = console.log;


async function syncModels() {
    try{
        // console.log("\t\t\n\nI am in Sync models\n\n")
        await sequelize.sync({
            alter:true,
            force: true
        }); 
        console.log("all models synchronized successfully");
    }catch(err){
        console.error(err);
    }
}

module.exports={
    syncModels
}