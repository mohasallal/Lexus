"use client";
import { useEffect, useState } from "react";
import { useActivitiesStore } from "@/store/activities";
import { useTimeSlotsStore } from "@/store/timeslots";
import { TimeSlot } from "@/types/timeslots";
import { Activity } from "@/types/activities";
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
  const { getTimeSlotsByActivity, loading: timeSlotsLoading } =
    useTimeSlotsStore();

  const [activityTimeSlots, setActivityTimeSlots] = useState<
    Record<number, TimeSlot[]>
  >({});
  const [loadingActivity, setLoadingActivity] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

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
        <p className="font-medium">خطأ في تحميل الأنشطة</p>
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
          لا توجد أنشطة متاحة
        </h3>
        <p className="text-gray-600">سيتم إضافة الأنشطة قريباً</p>
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
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-primary/20"
            >
              <CardContent className="p-0">
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-300">
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-500"
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
                    <p className="text-sm">صورة النشاط</p>
                  </div>
                </div>
              </CardContent>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-200">
                  {activity.name}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {activity.description}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <Button
                  onClick={() => handleDiscoverTimeSlots(activity)}
                  disabled={loadingActivity === activity.id}
                  className="w-full"
                  variant="default"
                >
                  {loadingActivity === activity.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري البحث...
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
                      اكتشف الأوقات المتاحة
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-right">
              {selectedActivity?.name} - الأوقات المتاحة
            </DialogTitle>
            <DialogDescription className="text-right">
              اختر الوقت المناسب لك من الأوقات المتاحة أدناه
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
                    className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer text-center"
                  >
                    <div className="font-semibold text-lg text-gray-800 mb-2">
                      {new Date(timeSlot.startTime).toLocaleTimeString(
                        "ar-SA",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </div>
                    <div className="text-sm text-primary font-medium">
                      {timeSlot.availableSeats} مقعد
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  لا توجد أوقات متاحة حالياً
                </h3>
                <p className="text-gray-600">
                  سيتم إضافة أوقات جديدة قريباً. يرجى المحاولة مرة أخرى لاحقاً.
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
