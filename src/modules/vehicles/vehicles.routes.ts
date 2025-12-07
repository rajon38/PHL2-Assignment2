import { Router } from "express";
import { vehicleControllers } from "./vehicles.controllers";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin"), vehicleControllers.vehicles);
router.get("/", auth("admin", "user"), vehicleControllers.getAllVehicles);
router.get("/:vehicleId", auth("admin", "user"), vehicleControllers.getOneVehicle);
router.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicle);
router.delete("/:vehicleId", auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;