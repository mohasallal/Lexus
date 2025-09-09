import { Router } from "express";
import { Login, Register } from "../controllers/auth.controller";
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

export default router;