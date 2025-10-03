import { Router } from "express";
import {
  login,
  me,
  register,
  updateRole,
} from "../controllers/auth.controller";
import { isAuthorizedRole } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.post(
  "/register",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN", "SUPERVISOR"),
  register
);
router.get("/me", authMiddleware, me);
router.put(
  "/role",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN"),
  updateRole
);

export default router;
