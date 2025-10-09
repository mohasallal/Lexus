import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  deleteRegistrations,
  getAllRegistrations,
  getUserRegistrations,
  getRegistrationById,
  getRegistrationsByTimeSlot,
  registerInTimeSlot,
} from "../controllers/registration.controller";
import { isAuthorizedRole } from "../middlewares/role.middleware";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN", "SUPERVISOR"),
  registerInTimeSlot
);
router.get(
  "/all",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN", "SUPERVISOR"),
  getAllRegistrations
);
router.get(
  "/:id",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN", "SUPERVISOR"),
  getRegistrationById
);
router.get(
  "/user/:userId",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN", "SUPERVISOR"),
  getUserRegistrations
);
router.get(
  "/activity/:activityId/timeslot/:timeSlotId",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN", "SUPERVISOR"),
  getRegistrationsByTimeSlot
);
router.delete(
  "/delete/:id",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN", "SUPERVISOR"),
  deleteRegistrations
);

export default router;
