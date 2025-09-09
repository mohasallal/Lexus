import { Request, Response } from "express";
import { verifyToken } from "../config/token";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = await verifyToken(token);
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
