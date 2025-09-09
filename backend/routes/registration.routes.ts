import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  deleteRegistrations,
  getAllRegistrations,
  getMyRegistrations,
  getRegistrationById,
  registerInTimeSlot,
} from "../controllers/registration.controller";
import { isAuthorizedRole } from "../middlewares/role.middleware";

const router = Router();

router.post("/create", authMiddleware, registerInTimeSlot);
router.get(
  "/all",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN", "SUPERVISOR"),
  getAllRegistrations
);
router.get("/:id", authMiddleware, getRegistrationById);
router.get("/my", authMiddleware, getMyRegistrations);
router.delete(
  "/delete/:id",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN", "SUPERVISOR"),
  deleteRegistrations
);

export default router;
