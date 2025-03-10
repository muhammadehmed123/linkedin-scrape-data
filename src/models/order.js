const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/pgSqlConfig');
const Product = require('./product');
const user = require('./user');
// const OrderProduct = require('./orderproduct');


const Order = sequelize.define('Order',{
    order_id:{
        type: DataTypes.UUID,
        primaryKey:true,
        defaultValue: DataTypes.UUIDV4,
    },
    order_date:{
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    total_amount:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    // products:{ 
    //     //here, product ids will be there
    //     type: DataTypes.JSONB,
    //     allowNull: false
    // }
});


// Define the many-to-many relationship
// Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'order_id' });

// Order.belongsToMany(Product, {through: 'OrderProduct', foreignKey: 'order_id'});

module.exports=Order;