import { Request, Response } from "express";
import { registerationSchema } from "../validations/registration";
import { db } from "../config/db";
import { activities, registrations, timeSlots, users } from "../schema/schema";
import { eq, count } from "drizzle-orm";
import { io } from "../server";

export const registerInTimeSlot = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const safeParsed = registerationSchema.safeParse(req.body);

    if (!safeParsed.success) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    const { timeSlotId } = safeParsed.data;

    const [slot] = await db
      .select()
      .from(timeSlots)
      .where(eq(timeSlots.id, timeSlotId));

    if (!slot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    const [{ total }] = await db
      .select({ total: count() })
      .from(registrations)
      .where(eq(registrations.timeSlotId, timeSlotId));

    if (slot.maxParticipants && total >= slot.maxParticipants) {
      return res.status(400).json({ message: "Time slot is full" });
    }

    const userRegisterations = await db
      .select({
        id: registrations.id,
        startTime: timeSlots.startTime,
        endTime: timeSlots.endTime,
      })
      .from(registrations)
      .innerJoin(timeSlots, eq(registrations.timeSlotId, timeSlots.id))
      .where(eq(registrations.userId, userId));

    const newStart = new Date(slot.startTime);
    const newEnd = new Date(slot.endTime);

    const hasConflict = userRegisterations.some(
      (r) => newStart < new Date(r.endTime) && newEnd > new Date(r.startTime)
    );

    if (hasConflict) {
      return res.status(400).json({
        message: "You already registered for another session at this time",
      });
    }

    const [newReg] = await db
      .insert(registrations)
      .values({
        userId: userId,
        timeSlotId: timeSlotId,
      })
      .returning();

    io.emit("registeration:created", {
      id: newReg.id,
      userId,
      timeSlotId,
      slotStart: slot.startTime,
      slotEnd: slot.endTime,
    });

    return res
      .status(201)
      .json({ message: "Registration successful", registration: newReg });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};

export const getAllRegistrations = async (req: Request, res: Response) => {
  try {
    const regs = await db
      .select({
        regId: registrations.id,
        userName: users.fname,
        userEmail: users.email,
        userPhone: users.phone,
        activityName: activities.name,
        slotStart: timeSlots.startTime,
        slotEnd: timeSlots.endTime,
      })
      .from(registrations)
      .leftJoin(users, eq(registrations.userId, users.id))
      .leftJoin(timeSlots, eq(registrations.timeSlotId, timeSlots.id))
      .leftJoin(activities, eq(timeSlots.activityId, activities.id));

    io.emit("registrations:update", regs);

    res.status(200).json({ registrations: regs });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};

export const getRegistrationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [reg] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, Number(id)));

    if (!reg) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json({ registration: reg });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};

export const getMyRegistrations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const regs = await db
      .select()
      .from(registrations)
      .where(eq(registrations.userId, userId));

    res.status(200).json({
      message: "Registrations fetched successfully",
      registrations: regs,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error + " + error });
  }
};

export const deleteRegistrations = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCount = await db
      .delete(registrations)
      .where(eq(registrations.id, Number(id)))
      .returning()
      .then((res) => res.length);

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }

    io.emit("registration:deleted", { id: Number(id) });

    res.status(200).json({ message: "Registration deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};
