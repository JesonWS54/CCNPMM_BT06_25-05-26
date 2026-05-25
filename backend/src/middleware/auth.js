import jwt from "jsonwebtoken"; // <--- ĐẢM BẢO CÓ DÒNG NÀY
import dotenv from "dotenv";

dotenv.config();

const auth = (req, res, next) => {
  const white_lists = ["/", "/register", "/login"];

  if (white_lists.find((item) => item === req.url)) {
    next();
  } else {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      try {
        // Lỗi xảy ra ở dòng này vì không tìm thấy biến 'jwt'
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(">>> Check token decoded: ", decoded);
        next();
      } catch (error) {
        return res.status(401).json({
          message: "Token bị hết hạn hoặc không hợp lệ",
        });
      }
    } else {
      return res.status(401).json({
        message: "Bạn không có quyền truy cập API này (Missing Token)",
      });
    }
  }
};

export default auth;
