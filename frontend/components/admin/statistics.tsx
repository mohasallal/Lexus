"use client";
import { useEffect } from "react";
import Box from "@/components/Box";
import GlassyCard from "@/components/GlassyCard";
import StatsSvg from "@/components/svgs/stats";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useActivitiesStore } from "@/store/activities";
import { useRegStore } from "@/store/registeration";
import { useTimeSlotsStore } from "@/store/timeslots";

const Statistics = () => {
  const { users, getAllUsers, initializeSocketListeners } = useAuthStore();
  const {
    activities,
    getActivities,
    initializeSocketListeners: initActivitiesSocketListeners,
  } = useActivitiesStore();
  const {
    registrations,
    getAllRegistrations,
    initializeSocketListeners: initRegSocketListeners,
  } = useRegStore();
  const {
    timeSlots,
    getTimeSlots,
    initializeSocketListeners: initTimeSlotsSocketListeners,
  } = useTimeSlotsStore();

  useEffect(() => {
    getAllUsers();
    getActivities();
    getAllRegistrations();
    getTimeSlots();

    initializeSocketListeners();
    initActivitiesSocketListeners();
    initRegSocketListeners();
    initTimeSlotsSocketListeners();
  }, [
    getAllUsers,
    getActivities,
    getAllRegistrations,
    getTimeSlots,
    initializeSocketListeners,
    initActivitiesSocketListeners,
    initRegSocketListeners,
    initTimeSlotsSocketListeners,
  ]);

  const guestsCount = users?.length || 0;
  const activitiesCount = activities?.length || 0;
  const registrationsCount = registrations?.length || 0;
  const timeSlotsCount = timeSlots?.length || 0;

  return (
    <Card className="w-full max-w-sm rounded-sm py-4">
      <CardHeader className="px-4">
        <GlassyCard
          className="bg-transparent shadow-none w-full max-w-full py-0 px-0"
          icon={<StatsSvg fill="white" />}
          title="EVENT STATISTICS"
          subColor="text-gray-700"
          titleColor="text-black"
          iconBgColor="bg-black"
        />
        <hr />
      </CardHeader>
      <CardContent className="px-4">
        <div className="mt-3 grid grid-cols-2 gap-4">
          <Box
            value={guestsCount}
            label="عدد الضيوف"
            fontColor="text-black"
            bgColor="bg-gray-200"
          />
          <Box
            value={activitiesCount}
            label="عدد الفعاليات"
            fontColor="text-black"
            bgColor="bg-gray-200"
          />
          <Box
            value={registrationsCount}
            label="عدد المسجلين"
            fontColor="text-black"
            bgColor="bg-gray-200"
          />
          <Box
            value={timeSlotsCount}
            label="عدد الأوقات المتاحة"
            fontColor="text-black"
            bgColor="bg-gray-200"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Statistics;
