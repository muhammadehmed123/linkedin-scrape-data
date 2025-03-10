const User = require("../models/user")

const findUser= async(where)=>{
    const isUserExists= await User.findOne({where});
    if(isUserExists){
        return true;
    }
    return false;
}

const findAllUsers= async(where)=>{
    const users= where?await User.findAll({
        where
    }): await User.findAll();

    if(users.length>0){
        return users;
    }
    return null;
}

const createUser= async(props)=>{
    const createUser = await User.create(props);
    if(createUser){
        return true;
    }
    return false;
}

module.exports= {findUser,createUser,findAllUsers};