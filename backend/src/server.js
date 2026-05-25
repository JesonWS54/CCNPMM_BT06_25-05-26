import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/api";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/ping", (req, res) => res.json({ ok: true, msg: "Server BT04 đang chạy!" }));
app.use("/api/v1", router);

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("MongoDB connected:", process.env.MONGO_DB_URL))
  .catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
