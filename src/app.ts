import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { userRoutes } from "./modules/users/users.routes";
const app = express();
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initializing DB
initDB();

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;