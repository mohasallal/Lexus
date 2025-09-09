import { NextFunction, Request, Response } from "express";
import { db } from "../config/db";
import { users } from "../schema/schema";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}

export const isAuthorizedRole = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user?.id) {
        res.status(400).json({ message: "Bad request: User not found" });
        return;
      }

      const roledUserResult = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      const roledUser = roledUserResult[0];

      if (!roledUser || !roledUser.role) {
        res
          .status(400)
          .json({ message: "Bad request: User or role not found" });
        return;
      }

      if (!roles.includes(roledUser.role)) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" + error });
    }
  };
};
