import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../config/db";
import { users } from "../schema/schema";
import { eq } from "drizzle-orm";
import { loginSchema, registerSchema } from "../validations/auth";
import { createToken } from "../config/token";

export const Login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password!);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = createToken(user.id.toString());

  res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fname: user.fname,
      lname: user.lname,
    },
    message: "Login successful",
  });
};

export const Register = async (req: Request, res: Response) => {
  const { email, password, fname, lname, phone } = registerSchema.parse(
    req.body
  );

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      fname,
      lname,
      phone,
      role: "ADMIN",
    })
    .returning();

  const token = createToken(newUser[0].id.toString());

  res.status(201).json({
    token,
    user: {
      id: newUser[0].id,
      email: newUser[0].email,
      fname: newUser[0].fname,
      lname: newUser[0].lname,
    },
    message: "Account created Successful",
  });
};
