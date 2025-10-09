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
  }, [getAllUsers, getActivities, getAllRegistrations, getTimeSlots]);

  // Initialize socket listeners only once when component mounts
  useEffect(() => {
    initializeSocketListeners();
    initActivitiesSocketListeners();
    initRegSocketListeners();
    initTimeSlotsSocketListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array = only run once on mount

  const guestsCount = users?.length || 0;
  const activitiesCount = activities?.length || 0;
  const registrationsCount = registrations?.length || 0;
  const timeSlotsCount = timeSlots?.length || 0;

  return (
    <Card className="w-full h-fit rounded-lg shadow-sm border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <GlassyCard
          className="bg-transparent shadow-none w-full max-w-full py-0 px-0"
          icon={<StatsSvg fill="white" />}
          title="EVENT STATISTICS"
          subColor="text-gray-600"
          titleColor="text-gray-900"
          iconBgColor="bg-gray-800"
        />
        <hr className="border-gray-200" />
      </CardHeader>
      <CardContent className="pb-6">
        <div className="grid grid-cols-2 gap-3">
          <Box
            value={guestsCount}
            label="Guests Count"
            fontColor="text-gray-800"
            bgColor="bg-gray-200 border border-blue-100"
          />
          <Box
            value={activitiesCount}
            label="Activities Count"
            fontColor="text-gray-800"
            bgColor="bg-gray-200 border border-green-100"
          />
          <Box
            value={registrationsCount}
            label="Registrations Count"
            fontColor="text-gray-800"
            bgColor="bg-gray-200 border border-purple-100"
          />
          <Box
            value={timeSlotsCount}
            label="Available Time Slots"
            fontColor="text-gray-800"
            bgColor="bg-gray-200 border border-amber-100"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Statistics;
