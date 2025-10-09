"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Users, Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActivitiesStore } from "@/store/activities";
import { useTimeSlotsStore } from "@/store/timeslots";
import { useRegStore } from "@/store/registeration";

import { Activity } from "@/types/activities";
import { TimeSlot } from "@/types/timeslots";
import EventSelectionDialog from "@/components/admin/dialogs/EventSelectionDialog";
import TimeSlotSelectionDialog from "@/components/admin/dialogs/TimeSlotSelectionDialog";
import UserSvg from "@/components/svgs/user";

const EventTimeSlots = () => {
  const { activities, getActivities } = useActivitiesStore();
  const { timeSlots, getTimeSlots } = useTimeSlotsStore();
  const {
    loading,
    registrations,
    initializeSocketListeners,
    getAllRegistrations,
  } = useRegStore();

  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isTimeSlotDialogOpen, setIsTimeSlotDialogOpen] = useState(false);
  const [isRegistreesDialogOpen, setIsRegistreesDialogOpen] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );

  const [viewTimeSlots, setViewTimeSlots] = useState<TimeSlot[]>([]);

  const filteredRegistrations =
    selectedActivity && selectedTimeSlot && registrations
      ? registrations
          .filter(
            (reg) =>
              reg.activity?.id === selectedActivity.id &&
              reg.timeSlotId === selectedTimeSlot.id
          )
          .map((reg) => ({
            regId: reg.id,
            userName:
              `${reg.user?.fname || ""} ${reg.user?.lname || ""}`.trim() ||
              "Unknown",
            userEmail: reg.user?.email || "",
            userPhone: reg.user?.phone,
          }))
      : [];

  useEffect(() => {
    getActivities();
    getTimeSlots();
    getAllRegistrations();
  }, [getActivities, getTimeSlots, getAllRegistrations]);

  useEffect(() => {
    initializeSocketListeners();
  }, [initializeSocketListeners]);

  const handleEventSelect = (activity: Activity) => {
    setSelectedActivity(activity);
    const activityTimeSlots =
      timeSlots?.filter((slot) => slot.activityId === activity.id) || [];

    const sortedTimeSlots = activityTimeSlots.sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    setViewTimeSlots(sortedTimeSlots);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = async (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const resetSelection = () => {
    setSelectedActivity(null);
    setSelectedTimeSlot(null);
    setViewTimeSlots([]);
    setIsEventDialogOpen(false);
    setIsTimeSlotDialogOpen(false);
    setIsRegistreesDialogOpen(false);
  };

  return (
    <Card className="w-full h-fit rounded-lg shadow-sm border-gray-200 bg-white">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Eye className="w-5 h-5 text-gray-700" />
          View Event Registrations
        </CardTitle>
        <hr className="border-gray-200" />
      </CardHeader>
      <CardContent className="space-y-4 pb-0">
        <Button
          className="w-full bg-gray-800 text-white hover:bg-gray-900 transition-colors"
          onClick={() => setIsEventDialogOpen(true)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Event Registrations
        </Button>

        {(selectedActivity || selectedTimeSlot) && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Last Selection:</h4>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              {selectedActivity && (
                <span className="bg-white px-2 py-1 rounded border text-black font-medium">
                  {selectedActivity.name}
                </span>
              )}
              {selectedTimeSlot && (
                <>
                  <span>→</span>
                  <span className="bg-white px-2 py-1 rounded border text-black font-medium">
                    {new Date(selectedTimeSlot.startTime).toLocaleString()}
                  </span>
                </>
              )}
              {selectedTimeSlot && (
                <>
                  <span>→</span>
                  <span
                    className={`px-2 py-1 rounded border font-medium ${
                      filteredRegistrations.length > 0
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {filteredRegistrations.length} user
                    {filteredRegistrations.length !== 1 ? "s" : ""} registered
                  </span>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetSelection}
              className="mt-2 text-gray-600 hover:bg-gray-100"
            >
              Clear Selection
            </Button>
          </div>
        )}

        <EventSelectionDialog
          isOpen={isEventDialogOpen}
          onClose={() => setIsEventDialogOpen(false)}
          onEventSelect={(activity) => {
            handleEventSelect(activity);
            setIsEventDialogOpen(false);
            setIsTimeSlotDialogOpen(true);
          }}
          activities={activities || []}
          selectedActivity={selectedActivity}
          viewMode={true}
        />

        <TimeSlotSelectionDialog
          isOpen={isTimeSlotDialogOpen}
          onClose={() => setIsTimeSlotDialogOpen(false)}
          onTimeSlotSelect={async (timeSlot) => {
            setIsTimeSlotDialogOpen(false);
            setIsRegistreesDialogOpen(true);
            await handleTimeSlotSelect(timeSlot);
          }}
          onBack={() => {
            setIsTimeSlotDialogOpen(false);
            setIsEventDialogOpen(true);
          }}
          activity={selectedActivity}
          timeSlots={viewTimeSlots}
        />

        <Dialog
          open={isRegistreesDialogOpen}
          onOpenChange={setIsRegistreesDialogOpen}
        >
          <DialogContent className="max-h-[60vh] w-2xl overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-black">
                    Registered Users ({filteredRegistrations.length})
                  </DialogTitle>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>
                      <strong>Event:</strong> {selectedActivity?.name}
                    </p>
                    <p>
                      <strong>Time Slot:</strong>{" "}
                      {selectedTimeSlot &&
                        new Date(selectedTimeSlot.startTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsRegistreesDialogOpen(false);
                    setIsTimeSlotDialogOpen(true);
                  }}
                  className="ml-4"
                >
                  ← Back
                </Button>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="text-gray-600 mt-2">
                    Loading registered users...
                  </p>
                </div>
              ) : filteredRegistrations.length > 0 ? (
                <div className="space-y-3">
                  {filteredRegistrations.map((user, index) => (
                    <div
                      key={user.regId || index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <UserSvg className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-black">
                            {user.userName}
                          </h5>
                          <div className="flex flex-col space-y-1 mt-2 text-sm text-gray-600">
                            {user.userEmail && (
                              <div className="flex items-center space-x-2">
                                <Mail className="w-3 h-3" />
                                <span>{user.userEmail}</span>
                              </div>
                            )}
                            {user.userPhone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-3 h-3" />
                                <span>{user.userPhone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No users registered for this time slot
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Users will appear here when they register
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EventTimeSlots;
