import path from "path";
import express from "express";

const configViewEngine = (app) => {
  // Cấu hình thư mục chứa các file giao diện (views)
  app.set("views", path.join("./src", "views"));
  app.set("view engine", "ejs");

  // Cấu hình thư mục chứa file tĩnh (public)
  app.use(express.static(path.join("./src", "public")));
};

export default configViewEngine;
