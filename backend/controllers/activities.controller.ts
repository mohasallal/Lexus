import { Request, Response } from "express";
import { db } from "../config/db";
import { activities } from "../schema/schema";
import { ActivitySchema } from "../validations/activities";
import { eq } from "drizzle-orm";

export const createActivity = async (req: Request, res: Response) => {
  try {
    const safeParsed = ActivitySchema.safeParse(req.body);

    if (!safeParsed.success) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const { name, description } = safeParsed.data;

    const [existingActivity] = await db
      .select()
      .from(activities)
      .where(eq(activities.name, name));

    if (existingActivity) {
      return res.status(409).json({ message: "Activity already exists" });
    }

    const [newActivity] = await db
      .insert(activities)
      .values({ name, description })
      .returning();

    res.status(201).json({
      activity: newActivity,
      message: "Activity created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const allActivities = await db.select().from(activities);

    res.status(200).json({ activities: allActivities });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const getActivityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [activity] = await db
      .select()
      .from(activities)
      .where(eq(activities.id, Number(id)));

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ activity });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const safeParsed = ActivitySchema.safeParse(req.body);

    if (!safeParsed.success) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const { name, description } = safeParsed.data;

    const [activity] = await db
      .select()
      .from(activities)
      .where(eq(activities.id, Number(id)));

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const [updatedActivity] = await db
      .update(activities)
      .set({ name, description })
      .where(eq(activities.id, Number(id)))
      .returning();

    res.status(200).json({
      activity: updatedActivity,
      message: "Activity updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [activity] = await db
      .select()
      .from(activities)
      .where(eq(activities.id, Number(id)));

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await db.delete(activities).where(eq(activities.id, Number(id)));

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error });
  }
};
