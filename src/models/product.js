const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/pgSqlConfig');
const Order = require('./order');
// const OrderProduct = require('./orderproduct');

const Product= sequelize.define('Product',{
    id:{
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    category:{
        type: DataTypes.ENUM('chair','sofa','cushion set','bar stool','dresser','cabinet'),
        defaultValue:'chair',
        allowNull: false
    },
    price:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    material:{
        type: DataTypes.STRING,
        allowNull: false
    },
    dimensions:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    currency:{
        type: DataTypes.ENUM('USD','PKR','INR'),
        defaultValue:'PKR',
        allowNull: false
     },
    // created_at:{
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.NOW,
    //     allowNull: false
    // },
    // updated_at:{
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.NOW,
    //     allowNull: false
    // },
    discount:{
        type: DataTypes.FLOAT,
        defaultValue:0,
    },
    purchase_count:{
        type: DataTypes.INTEGER,
        defaultValue:0
    }
});


// Define the many-to-many relationship
// Product.belongsToMany(Order, { through: 'OrderProduct', foreignKey: 'product_id' });

module.exports=Product;