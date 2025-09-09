import { Request, Response } from "express";
import { db } from "../config/db";
import { activities, timeSlots } from "../schema/schema";
import { eq } from "drizzle-orm";
import { timeSlotSchema } from "../validations/time";

export const createTimeSlot = async (req: Request, res: Response) => {
  try {
    const { activityId, startTime, endTime, maxParticipants } =
      timeSlotSchema.parse(req.body);

    const [activity] = await db
      .select()
      .from(activities)
      .where(eq(activities.id, activityId));

    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    const [slot] = await db
      .insert(timeSlots)
      .values({
        activityId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        maxParticipants,
      })
      .returning();

    res.status(201).json({ message: "Time slot created", slot });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTimeSlots = async (req: Request, res: Response) => {
  try {
    const all = await db.select().from(timeSlots);
    res.status(201).json({
      timeSlots: all,
      message: "Time slots fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const getTimeSlotById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [slot] = await db
      .select()
      .from(timeSlots)
      .where(eq(timeSlots.id, Number(id)));

    if (!slot) return res.status(404).json({ message: "Time slot not found" });

    res.status(200).json({ slot });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const updateTimeSlot = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { activityId, startTime, endTime, maxParticipants } =
      timeSlotSchema.parse(req.body);

    const [slot] = await db
      .update(timeSlots)
      .set({
        activityId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        maxParticipants,
      })
      .where(eq(timeSlots.id, id))
      .returning();

    if (!slot) return res.status(404).json({ message: "Time slot not found" });

    res.json({ message: "Time slot updated", slot });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTimeSlot = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await db
      .delete(timeSlots)
      .where(eq(timeSlots.id, id))
      .returning();
    if (!deleted.length)
      return res.status(404).json({ message: "Time slot not found" });
    res.json({ message: "Time slot deleted", slot: deleted[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
