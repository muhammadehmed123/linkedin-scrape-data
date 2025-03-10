const testController = require("./testController");
const userController = require("./userController");
const paymentController = require("./paymentController");

const registerController = userController.registerController;
const testingController = testController.testController;
const payController = paymentController.getPaymentController;

module.exports = {
  registerController,
  testingController,
  payController
};
