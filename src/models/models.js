const User = require('./user');
const Product = require('./product');
// const OrderProduct = require('./orderproduct');
const Order = require('./order');
const Payment = require('./payment');
const OrderProduct = require('./orderProduct');
const Delivery = require('./delivery');

// Payment.hasOne(Order, {foreignKey: 'order_id'});
// Order.belongsTo(Payment, {foreignKey: 'order_id'});

//Many-To-Many relation between order and product
Order.belongsToMany(Product, {through: OrderProduct, foreignKey:'order_id'});
Product.belongsToMany(Order, {through: OrderProduct, foreignKey:'product_id'});

//   console.log("\n\n\t\tI am executed\n\n");

Order.hasOne(Payment, { foreignKey: 'orderId', as:"payment" });
Payment.belongsTo(Order, { foreignKey: 'orderId', as:"order" });

// A user can place many orders
// An order belongs to a single user
// Foreign key in the Order table
// Alias for the relation
User.hasMany(Order, {foreignKey: 'userId', as: 'orders'});            
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });


//One Order Corresponds to One delivery
Order.hasOne(Delivery, { foreignKey: 'orderId', as:"delivery"});
Delivery.belongsTo(Order, { foreignKey: 'orderId', as:"order"});

/*************** */
// Many-To-Many relation between order and product through OrderProduct
// Order.belongsToMany(Product, {
//     through: 'order_product',
//     foreignKey: 'order_id',
//     otherKey: 'product_id'
// });

// Product.belongsToMany(Order, {
//     through: 'order_product',
//     foreignKey: 'product_id',
//     otherKey: 'order_id'
// });
/*************** */

module.exports = {User, Order, Product, Payment};