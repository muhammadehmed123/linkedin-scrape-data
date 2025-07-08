const { Op } = require("sequelize");
const User = require("../models/user");
const userService = require("../services/userService");
const { encryptPassword } = require("../utils/encryptPassword");
const { comparePassword } = require("../utils/comparePassword");
const signJwt = require("../utils/jwtSign");
const { findUser } = require("../utils/findUser");

const registerUser = async (data) => {
  try {
    const hashPassword = await encryptPassword(data.password);
    //check if user exists
    if (await userService.findUser({ email: data.email })) {
      return {
        status: 409,
        message: "user already exists",
      };
    }
    //register user
    const createUser = userService.createUser({ ...data, password: hashPassword });
    if (createUser) {
      return {
        status: 200,
        message: "user has been created successfully",
      };
    }
    return {
      status: 500,
      message: "user creation failed",
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
};

const loginUser = async (data) => {
  try {
    const { email, password, user_role } = data;
    const user = await findUser({
      [Op.and]: {
        email,
        user_role,
      },
    });

    console.log(user)

    if (user) {
      if (!(await comparePassword(password, user.password))) {
        return {
          status: 400,
          message: "password is wrong",
        };
      }
      const token = signJwt({
        email,
        password,
        user_role,
      });
      return {
        status: 200,
        message: "user logged in successfully",
        token,
      };
    }
    return {
      status: 404,
      message: "user not found",
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: err.message,
    };
  }
};

module.exports = {
  registerUser,
  loginUser,
};
