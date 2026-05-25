import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
    // 1. Mã hóa mật khẩu
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // 2. Lưu vào database
    let result = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: "USER",
    });

    return result;
  } catch (error) {
    console.log(">>> Check error: ", error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return { EC: 2, EM: "Email/Password không hợp lệ" };
      } else {
        // TẠO JWT TOKEN Ở ĐÂY
        const payload = {
          email: user.email,
          name: user.name,
        };

        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        return {
          EC: 0,
          access_token, // Trả token về cho Client
          user: {
            email: user.email,
            name: user.name,
          },
        };
      }
    } else {
      return { EC: 1, EM: "Email/Password không hợp lệ" };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { createUserService, loginService };
