import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAuthorizedRole } from "../middlewares/role.middleware";
import {
  createTimeSlot,
  deleteTimeSlot,
  getTimeSlotById,
  getTimeSlots,
  updateTimeSlot,
} from "../controllers/timeSlots.controller";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN"),
  createTimeSlot
);
router.get("/all", getTimeSlots);
router.get("/:id", getTimeSlotById);
router.put(
  "/update/:id",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN"),
  updateTimeSlot
);
router.delete(
  "/delete/:id",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN"),
  deleteTimeSlot
);

export default router;
