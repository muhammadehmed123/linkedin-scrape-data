const User = require("../models/user")

const findUser= async (where)=>{
    return await User.findOne({
        where
    })
}

module.exports= {
    findUser
}