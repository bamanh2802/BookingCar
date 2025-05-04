import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRoutes } from "./userRoutes";

const Router = express.Router();

Router.use("/test", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Hello" });
});

Router.use("/user", userRoutes);

export const API_V1 = Router;
