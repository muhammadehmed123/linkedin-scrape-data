const { sequelize } = require('../../config/pgSqlConfig');
const { DataTypes, Model } = require('sequelize');

const Delivery = sequelize.define('delivery',{
    id:{
        type: DataTypes.UUID,
        primaryKey:true,
        defaultValue: DataTypes.UUIDV4,
    },
    delivery_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    delivery_address: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM('pending', 'approved', 'shipped', 'delivered'),
        defaultValue: 'pending',
    },
    // products:{ 
    //     //here, product ids will be there
    //     type: DataTypes.JSONB,
    //     allowNull: false
    // }
});
module.exports = Delivery;