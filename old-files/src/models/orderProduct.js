const { sequelize } = require('../../config/pgSqlConfig');
const { DataTypes } = require('sequelize');

const OrderProduct = sequelize.define('OrderProduct',{
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
})

module.exports = OrderProduct;