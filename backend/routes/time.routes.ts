import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAuthorizedRole } from "../middlewares/role.middleware";
import {
  createTimeSlot,
  deleteTimeSlot,
  getTimeSlotById,
  getTimeSlots,
  getTimeSlotsByActivity,
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
router.get("/activity/:activityId", getTimeSlotsByActivity);
router.put(
  "/update/:id",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN", "SUPERVISOR"),
  updateTimeSlot
);
router.delete(
  "/delete/:id",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN", "SUPERVISOR"),
  deleteTimeSlot
);

export default router;
