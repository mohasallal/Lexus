import { activities, timeSlots } from "../schema/schema";
import { db } from "./db"; 

async function main() {
const createdActivities = await db
  .insert(activities)
  .values([
    {
      name: "Golf Shooting Range",
      description:
        "Test your precision and skill at the golf shooting range, designed for quick fun challenges and friendly competition.",
    },
    {
      name: "Mini Golf Tournament",
      description:
        "Compete in a mini golf tournament! Perfect for guests who want a mix of fun and competition in a casual setting.",
    },
    {
      name: "Test Drives",
      description:
        "Experience the latest cars firsthand with guided test drives, giving you a feel of performance and comfort.",
    },
  ])
  .returning();

  console.log("Activities seeded:", createdActivities);

  for (const activity of createdActivities) {
    const slots: {
      activityId: number;
      startTime: Date;
      endTime: Date;
      maxParticipants: number;
    }[] = [];

    const baseDate = new Date(); 
    baseDate.setHours(10, 0, 0, 0);

    for (let i = 0; i < 16; i++) {
      const start = new Date(baseDate.getTime() + i * 30 * 60 * 1000);
      const end = new Date(start.getTime() + 30 * 60 * 1000);

      slots.push({
        activityId: activity.id,
        startTime: start,
        endTime: end,
        maxParticipants: 10
      });
    }

    await db.insert(timeSlots).values(slots);
    console.log(`Time slots created for activity ${activity.name}`);
  }

  console.log("Seeding completed ✅");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
