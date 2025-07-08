const { compare } =require("bcrypt")

const comparePassword= async(userPassword,dbPassword)=>{
    return await compare(userPassword,dbPassword)
}

module.exports={comparePassword}