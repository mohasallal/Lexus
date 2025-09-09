import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../config/db";
import { users, role } from "../schema/schema";
import { eq } from "drizzle-orm";
import {
  loginSchema,
  registerSchema,
  updateRoleSchema,
} from "../validations/auth";
import { createToken } from "../config/token";

type RoleType = (typeof role.enumValues)[number];

export const Login = async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const { email, password } = parseResult.data;

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
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const Register = async (req: Request, res: Response) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const { email, password, fname, lname, phone } = parseResult.data;

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
        role: "SUPERVISOR" as RoleType,
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
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const Me = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "Bad request: User not found" });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const parseResult = updateRoleSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const { id, role } = parseResult.data;

    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await db
      .update(users)
      .set({ role: role as RoleType })
      .where(eq(users.id, id))
      .returning();

    res.status(200).json({
      user: {
        id: updatedUser[0].id,
        email: updatedUser[0].email,
        fname: updatedUser[0].fname,
        lname: updatedUser[0].lname,
        phone: updatedUser[0].phone,
        role: updatedUser[0].role,
        createdAt: updatedUser[0].createdAt,
      },
      message: "User role updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
