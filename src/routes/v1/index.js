import express from "express";
import { StatusCodes } from "http-status-codes";
import userRoleRoutes from "./userRoleRoutes";
import { userRoutes } from "./userRoutes";

const Router = express.Router();

Router.use("/test", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Hello" });
});

Router.use("/user", userRoutes);
Router.use("/roles", userRoleRoutes);

export const API_V1 = Router;
