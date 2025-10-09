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

// Type for registered user data from backend
interface RegisteredUser {
  regId: number;
  userName: string;
  userEmail: string;
  userPhone?: string;
}
import { Activity } from "@/types/activities";
import { TimeSlot } from "@/types/timeslots";
import EventSelectionDialog from "@/components/admin/dialogs/EventSelectionDialog";
import TimeSlotSelectionDialog from "@/components/admin/dialogs/TimeSlotSelectionDialog";
import UserSvg from "@/components/svgs/user";

const EventTimeSlots = () => {
  const { activities, getActivities } = useActivitiesStore();
  const { timeSlots, getTimeSlots } = useTimeSlotsStore();
  const { getRegistrationsByActivityTimeSlot, loading } = useRegStore();

  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isTimeSlotDialogOpen, setIsTimeSlotDialogOpen] = useState(false);
  const [isRegistreesDialogOpen, setIsRegistreesDialogOpen] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [viewTimeSlots, setViewTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    getActivities();
    getTimeSlots();
  }, [getActivities, getTimeSlots]);

  const handleEventSelect = (activity: Activity) => {
    setSelectedActivity(activity);
    const activityTimeSlots =
      timeSlots?.filter((slot) => slot.activityId === activity.id) || [];
    setViewTimeSlots(activityTimeSlots);
    setSelectedTimeSlot(null);
    setRegisteredUsers([]);
  };

  const handleTimeSlotSelect = async (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    if (selectedActivity) {
      const users = await getRegistrationsByActivityTimeSlot(
        selectedActivity.id,
        timeSlot.id
      );
      setRegisteredUsers(users || []);
    }
  };

  const resetSelection = () => {
    setSelectedActivity(null);
    setSelectedTimeSlot(null);
    setRegisteredUsers([]);
    setViewTimeSlots([]);
    setIsEventDialogOpen(false);
    setIsTimeSlotDialogOpen(false);
    setIsRegistreesDialogOpen(false);
  };

  return (
    <Card className="w-full h-fit rounded-lg shadow-sm border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Eye className="w-5 h-5 text-gray-700" />
          View Event Registrations
        </CardTitle>
        <hr className="border-gray-200" />
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        {/* Main Button to Start Flow */}
        <Button
          className="w-full bg-gray-800 text-white hover:bg-gray-900 transition-colors"
          onClick={() => setIsEventDialogOpen(true)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Event Registrations
        </Button>

        {/* Current Selection Display */}
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
              {registeredUsers.length > 0 && (
                <>
                  <span>→</span>
                  <span className="bg-green-100 px-2 py-1 rounded border text-green-800 font-medium">
                    {registeredUsers.length} users found
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

        {/* Event Selection Dialog */}
        <EventSelectionDialog
          isOpen={isEventDialogOpen}
          onClose={() => setIsEventDialogOpen(false)}
          onEventSelect={(activity) => {
            handleEventSelect(activity);
            setIsEventDialogOpen(false);
            setIsTimeSlotDialogOpen(true);
          }}
          onRegister={() => {}} // Not used in this context
          activities={activities || []}
          selectedActivity={selectedActivity}
        />

        {/* Time Slot Selection Dialog */}
        <TimeSlotSelectionDialog
          isOpen={isTimeSlotDialogOpen}
          onClose={() => setIsTimeSlotDialogOpen(false)}
          onTimeSlotSelect={async (timeSlot) => {
            setIsTimeSlotDialogOpen(false);
            // Show the dialog immediately with loading state
            setIsRegistreesDialogOpen(true);
            // Then fetch the data
            await handleTimeSlotSelect(timeSlot);
          }}
          onBack={() => {
            setIsTimeSlotDialogOpen(false);
            setIsEventDialogOpen(true);
          }}
          activity={selectedActivity}
          timeSlots={viewTimeSlots}
        />

        {/* Registered Users Dialog */}
        <Dialog
          open={isRegistreesDialogOpen}
          onOpenChange={setIsRegistreesDialogOpen}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-black">
                    Registered Users ({registeredUsers.length})
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
              ) : registeredUsers.length > 0 ? (
                <div className="space-y-3">
                  {registeredUsers.map((user, index) => (
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
