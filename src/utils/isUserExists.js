const User = require("../models/user")

const isUserExists= async(where)=>{
    const isUserExists= await User.findOne({where});
    if(isUserExists){
        return true;
    }
    return false;
}

module.exports= isUserExists;