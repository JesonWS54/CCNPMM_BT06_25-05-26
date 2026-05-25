import { createUserService, loginService } from "../services/userService";
import User from "../models/user";
const postCreateUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Gọi đến service để xử lý lưu dữ liệu
  const data = await createUserService(name, email, password);

  return res.status(200).json({
    EC: 0, // Error Code = 0 (Thành công)
    data: data,
  });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);

  return res.status(200).json(data);
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({
      EC: 0,
      data: users,
    });
  } catch (error) {
    // THÊM DÒNG NÀY ĐỂ XEM LỖI Ở TERMINAL
    console.log("---------- CHECK ERROR GET USERS ----------");
    console.log(error);
    console.log("-------------------------------------------");

    return res.status(500).json({
      EC: -1,
      message: "Lỗi server: " + error.message, // Gửi cả thông báo lỗi về Frontend để xem
    });
  }
};

export { postCreateUser, postLogin, getUsers };
