const testController = require("../controllers/testController");

const testRoute=[
    {
        url:'/',
        method:'GET',
        handler: testController.testController
    }
]

module.exports=testRoute