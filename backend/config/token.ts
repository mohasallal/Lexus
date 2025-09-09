import jsonwebtoken from "jsonwebtoken";
import { db } from "./db";
import { users } from "../schema/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "oursupersecretkey";

export const createToken = (userId: string): string => {
  const token = jsonwebtoken.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
  return token;
};

export const verifyToken = async (token: string) => {
  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET);

    const { userId } = decoded as { userId: string };
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(userId)));
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
