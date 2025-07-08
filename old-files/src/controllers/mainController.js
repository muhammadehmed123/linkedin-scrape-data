const testController = require("./testController");
const userController = require("./userController");
const scraperController= require('./jobScraperController');
const paymentController = require("./paymentController");

const registerController = userController.registerController;
const testingController = testController.testController;
const payController = paymentController.getPaymentController;
const scrapeController= scraperController.getLinkedinJobsController

module.exports = {
  registerController,
  testingController,
  payController,
  scrapeController
};
