import { Router } from "express";
import {
  Login,
  Me,
  Register,
  updateRole,
} from "../controllers/auth.controller";
import { isAuthorizedRole } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", Login);
router.post(
  "/register",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN"),
  Register
);
router.get("/me", authMiddleware, Me);
router.patch(
  "/role",
  authMiddleware,
  isAuthorizedRole("ADMIN", "SUPERADMIN"),
  updateRole
);

export default router;
