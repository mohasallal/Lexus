"use client";
import { useEffect, useState } from "react";
import { useActivitiesStore } from "@/store/activities";
import { useTimeSlotsStore } from "@/store/timeslots";
import { useRegStore } from "@/store/registeration";
import { TimeSlot } from "@/types/timeslots";
import { Activity } from "@/types/activities";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from "@/components/ui/dialog";

const ActivitiesCards = () => {
  const { activities, loading, error, getActivities } = useActivitiesStore();
  const { getTimeSlotsByActivity } = useTimeSlotsStore();
  const { registrations, initializeSocketListeners } = useRegStore();

  const [activityTimeSlots, setActivityTimeSlots] = useState<
    Record<number, TimeSlot[]>
  >({});
  const [loadingActivity, setLoadingActivity] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  const getLiveRegisteredCount = (timeSlotId: number) => {
    if (!registrations) {
      console.log("No registrations data available");
      return 0;
    }
    const filtered = registrations.filter(
      (reg) => reg.timeSlotId === timeSlotId
    );
    console.log(
      `TimeSlot ${timeSlotId}: found ${filtered.length} registrations`,
      filtered
    );
    console.log("All registrations:", registrations);
    return filtered.length;
  };

  useEffect(() => {
    if (dialogOpen) {
      initializeSocketListeners();
    }
  }, [dialogOpen, initializeSocketListeners]);

  useEffect(() => {
    getActivities();
  }, [getActivities]);

  const handleDiscoverTimeSlots = async (activity: Activity) => {
    try {
      setLoadingActivity(activity.id);
      setSelectedActivity(activity);

      const timeSlots = await getTimeSlotsByActivity(activity.id);
      if (timeSlots) {
        setActivityTimeSlots((prev) => ({
          ...prev,
          [activity.id]: timeSlots,
        }));
      }

      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch time slots:", error);
    } finally {
      setLoadingActivity(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md">
        <p className="font-medium">Error loading Activities</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (activities && activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No activities are avialable{" "}
        </h3>
        <p className="text-gray-600">Activities will be added soon...</p>
      </div>
    );
  }
  return (
    <>
      {/* Activities Grid */}
      {activities && activities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 hover:shadow-xl transition-all duration-300 cursor-pointer group pt-0"
            >
              <CardContent className="p-0">
                <div className="w-full h-48 bg-white/5 backdrop-blur-sm border-b border-white/10 rounded-t-xl flex items-center justify-center group-hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                  {activity.imageUrl ? (
                    <Image
                      src={activity.imageUrl}
                      alt={activity.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-white/60 text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-white/80">Activity Image</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-white group-hover:text-white/90 transition-colors duration-200">
                  {activity.name}
                </CardTitle>
                <CardDescription className="text-white/70 leading-relaxed">
                  {activity.description}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <Button
                  onClick={() => handleDiscoverTimeSlots(activity)}
                  disabled={loadingActivity === activity.id}
                  className="w-full bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/40 text-white backdrop-blur-sm"
                  variant="outline"
                >
                  {loadingActivity === activity.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Discover Available Times
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Time Slots Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-black/80 backdrop-blur-xl border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-left text-white">
              {selectedActivity?.name} - Available Times
            </DialogTitle>
            <DialogDescription className="text-left text-white/70">
              Choose the time that suits you from the available times below
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            {selectedActivity &&
            activityTimeSlots[selectedActivity.id] &&
            activityTimeSlots[selectedActivity.id].length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {activityTimeSlots[selectedActivity.id].map((timeSlot) => (
                  <div
                    key={timeSlot.id}
                    className="p-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-center rounded-lg"
                  >
                    <div className="font-semibold text-lg text-white mb-2">
                      {new Date(timeSlot.startTime).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </div>
                    <div className="text-sm text-white/80 font-medium">
                      {(() => {
                        const registeredCount = getLiveRegisteredCount(
                          timeSlot.id
                        );
                        const seatsLeft =
                          timeSlot.maxParticipants - registeredCount;
                        console.log(
                          `TimeSlot ${timeSlot.id}: maxParticipants=${timeSlot.maxParticipants}, registeredCount=${registeredCount}, seatsLeft=${seatsLeft}`
                        );
                        return seatsLeft;
                      })()}{" "}
                      seats left
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No time slots are currently available
                </h3>
                <p className="text-white/70">
                  New times will be added soon. Please try again later.
                </p>
              </div>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActivitiesCards;
