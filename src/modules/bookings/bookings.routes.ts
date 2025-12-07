import { Router } from "express";
import { bookingControllers } from "./bookings.controllers";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBooking);
router.get("/", auth("admin", "customer"), bookingControllers.getAllBookings);
router.put("/:bookingId", auth("admin", "customer"), bookingControllers.updateBookingStatus);

export const bookingRoutes = router;