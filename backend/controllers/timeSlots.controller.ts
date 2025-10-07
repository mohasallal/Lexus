import { Request, Response } from "express";
import { db } from "../config/db";
import { activities, timeSlots, registrations } from "../schema/schema";
import { eq, count, sql } from "drizzle-orm";
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

    // Add the additional fields for consistency with other endpoints
    const slotWithAvailability = {
      ...slot,
      registeredCount: 0,
      availableSeats: maxParticipants,
    };

    res
      .status(201)
      .json({ message: "Time slot created", slot: slotWithAvailability });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTimeSlots = async (req: Request, res: Response) => {
  try {
    const all = await db
      .select({
        id: timeSlots.id,
        activityId: timeSlots.activityId,
        startTime: timeSlots.startTime,
        endTime: timeSlots.endTime,
        maxParticipants: timeSlots.maxParticipants,
        createdAt: timeSlots.createdAt,
        registeredCount: sql<number>`COALESCE(COUNT(${registrations.id}), 0)`,
        availableSeats: sql<number>`COALESCE(${timeSlots.maxParticipants} - COUNT(${registrations.id}), ${timeSlots.maxParticipants})`,
      })
      .from(timeSlots)
      .leftJoin(registrations, eq(timeSlots.id, registrations.timeSlotId))
      .groupBy(timeSlots.id);

    res.status(200).json({
      timeSlots: all,
      message: "Time slots fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const getTimeSlotsByActivity = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    const slots = await db
      .select({
        id: timeSlots.id,
        activityId: timeSlots.activityId,
        startTime: timeSlots.startTime,
        endTime: timeSlots.endTime,
        maxParticipants: timeSlots.maxParticipants,
        createdAt: timeSlots.createdAt,
        registeredCount: sql<number>`COALESCE(COUNT(${registrations.id}), 0)`,
        availableSeats: sql<number>`COALESCE(${timeSlots.maxParticipants} - COUNT(${registrations.id}), ${timeSlots.maxParticipants})`,
      })
      .from(timeSlots)
      .leftJoin(registrations, eq(timeSlots.id, registrations.timeSlotId))
      .where(eq(timeSlots.activityId, Number(activityId)))
      .groupBy(timeSlots.id);

    res.status(200).json({ timeSlots: slots });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const getTimeSlotById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [slot] = await db
      .select({
        id: timeSlots.id,
        activityId: timeSlots.activityId,
        startTime: timeSlots.startTime,
        endTime: timeSlots.endTime,
        maxParticipants: timeSlots.maxParticipants,
        createdAt: timeSlots.createdAt,
        registeredCount: sql<number>`COALESCE(COUNT(${registrations.id}), 0)`,
        availableSeats: sql<number>`COALESCE(${timeSlots.maxParticipants} - COUNT(${registrations.id}), ${timeSlots.maxParticipants})`,
      })
      .from(timeSlots)
      .leftJoin(registrations, eq(timeSlots.id, registrations.timeSlotId))
      .where(eq(timeSlots.id, Number(id)))
      .groupBy(timeSlots.id);

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

    // Get the updated time slot with availability information
    const [updatedSlotWithAvailability] = await db
      .select({
        id: timeSlots.id,
        activityId: timeSlots.activityId,
        startTime: timeSlots.startTime,
        endTime: timeSlots.endTime,
        maxParticipants: timeSlots.maxParticipants,
        createdAt: timeSlots.createdAt,
        registeredCount: sql<number>`COALESCE(COUNT(${registrations.id}), 0)`,
        availableSeats: sql<number>`COALESCE(${timeSlots.maxParticipants} - COUNT(${registrations.id}), ${timeSlots.maxParticipants})`,
      })
      .from(timeSlots)
      .leftJoin(registrations, eq(timeSlots.id, registrations.timeSlotId))
      .where(eq(timeSlots.id, id))
      .groupBy(timeSlots.id);

    res.json({
      message: "Time slot updated",
      slot: updatedSlotWithAvailability,
    });
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
