import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAuthorizedRole } from "../middlewares/role.middleware";
import {
  createActivity,
  deleteActivity,
  getActivityById,
  getAllActivities,
  updateActivity,
} from "../controllers/activities.controller";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN"),
  createActivity
);
router.get("/all", getAllActivities);
router.get("/:id", getActivityById);
router.put(
  "/update/:id",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN"),
  updateActivity
);
router.delete(
  "/delete/:id",
  authMiddleware,
  isAuthorizedRole("SUPERADMIN"),
  deleteActivity
);

export default router;
