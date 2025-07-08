const dotenv = require('dotenv')
const jwt= require('jsonwebtoken')
dotenv.config()


const signJwt=(data)=>{
    const verificationToken= jwt.sign(data,process.env.JWT_SECRET,{
        expiresIn:'10h'
    })
    return verificationToken;
}

module.exports=signJwt;