"use client";
import { useEffect, useState } from "react";
import GlassyCard from "@/components/GlassyCard";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  Calendar,
  Clock,
  Mail,
  Phone,
  Shield,
  Plus,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAuthStore } from "@/store/auth";
import { useActivitiesStore } from "@/store/activities";
import { useRegStore } from "@/store/registeration";
import { useTimeSlotsStore } from "@/store/timeslots";
import { User } from "@/types/auth";
import { TimeSlot } from "@/types/timeslots";
import { Registration } from "@/types/registration";
import { Activity } from "@/types/activities";
import EventSelectionDialog from "@/components/admin/dialogs/EventSelectionDialog";
import TimeSlotSelectionDialog from "@/components/admin/dialogs/TimeSlotSelectionDialog";

const RegisteredGuests = () => {
  const { users, getAllUsers, initializeSocketListeners } = useAuthStore();
  const {
    activities,
    getActivities,
    initializeSocketListeners: initActivitiesSocketListeners,
  } = useActivitiesStore();
  const {
    getAllRegistrations,
    getRegistrationsByUserId,
    createRegistration,
    deleteRegistration,
    initializeSocketListeners: initRegSocketListeners,
  } = useRegStore();
  const {
    timeSlots,
    getTimeSlots,
    initializeSocketListeners: initTimeSlotsSocketListeners,
  } = useTimeSlotsStore();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [userRegistrations, setUserRegistrations] = useState<Registration[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  // Registration dialog states
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isTimeSlotDialogOpen, setIsTimeSlotDialogOpen] = useState(false);
  const [selectedRegistrationActivity, setSelectedRegistrationActivity] =
    useState<Activity | null>(null);
  const [selectedRegistrationTimeSlot, setSelectedRegistrationTimeSlot] =
    useState<TimeSlot | null>(null);
  const [registrationTimeSlots, setRegistrationTimeSlots] = useState<
    TimeSlot[]
  >([]);

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

  // Get first letter of user's first name
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // Format time to display only time (no date)
  const formatTime = (timeString: string) => {
    try {
      // If it's already in HH:MM format, return as is
      if (/^\d{1,2}:\d{2}$/.test(timeString)) {
        return timeString;
      }

      // If it's a full datetime string, extract time
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }

      // Fallback to original string
      return timeString;
    } catch {
      return timeString;
    }
  };

  // Handle user row click - open user details dialog
  const handleUserClick = async (user: User) => {
    setSelectedUser(user);

    // Get user's current registrations using the specific endpoint
    try {
      const userRegs = await getRegistrationsByUserId(user.id);
      setUserRegistrations(userRegs || []);
    } catch (error) {
      console.error("Failed to get user registrations:", error);
      setUserRegistrations([]);
    }

    // Open user details dialog
    setIsDialogOpen(true);
  };

  // Handle registration removal
  const handleRemoveRegistration = async (registrationId: number) => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      await deleteRegistration(registrationId);
      // Refresh user registrations by fetching from the server
      const userRegs = await getRegistrationsByUserId(selectedUser.id);
      setUserRegistrations(userRegs || []);
    } catch (error) {
      console.error("Failed to remove registration:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get activity name by time slot ID
  const getActivityNameByTimeSlotId = (timeSlotId: number) => {
    const timeSlot = timeSlots?.find((ts) => ts.id === timeSlotId);
    if (!timeSlot) return "Unknown Activity";

    const activity = activities?.find((act) => act.id === timeSlot.activityId);
    return activity ? activity.name : "Unknown Activity";
  };

  // Registration dialog handlers
  const handleRegisterDialogClose = () => {
    setIsRegisterDialogOpen(false);
    setSelectedRegistrationActivity(null);
    setSelectedRegistrationTimeSlot(null);
    setRegistrationTimeSlots([]);
  };

  const handleEventSelect = (activity: Activity) => {
    setSelectedRegistrationActivity(activity);

    // Get time slots for this activity
    const activityTimeSlots =
      timeSlots?.filter((ts) => ts.activityId === activity.id) || [];
    setRegistrationTimeSlots(activityTimeSlots);

    // Open time slot dialog
    setIsTimeSlotDialogOpen(true);
  };

  const handleRegistrationTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedRegistrationTimeSlot(timeSlot);
    setIsTimeSlotDialogOpen(false);
  };

  const handleTimeSlotDialogBack = () => {
    setIsTimeSlotDialogOpen(false);
  };

  const handleRegisterUser = async () => {
    if (
      !selectedUser ||
      !selectedRegistrationActivity ||
      !selectedRegistrationTimeSlot
    ) {
      console.error("Missing required data for registration");
      return;
    }

    setLoading(true);
    try {
      await createRegistration(
        selectedUser.id,
        selectedRegistrationTimeSlot.id
      );

      // Refresh global data
      getAllRegistrations();

      // Refresh user-specific registrations for the user details dialog
      if (selectedUser) {
        const userRegs = await getRegistrationsByUserId(selectedUser.id);
        setUserRegistrations(userRegs || []);
      }

      // Close dialogs and reset state
      handleRegisterDialogClose();

      console.log("User registered successfully!");
    } catch (error) {
      console.error("Failed to register user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get time slot details for display with formatted time
  const getFormattedTimeSlotDetails = (timeSlotId: number) => {
    const timeSlot = timeSlots?.find((ts) => ts.id === timeSlotId);
    return timeSlot
      ? `${formatTime(timeSlot.startTime)} - ${formatTime(timeSlot.endTime)}`
      : "Unknown Time";
  };

  return (
    <>
      <Card className="w-full rounded-sm py-4 gap-0">
        <CardHeader className="px-4">
          <GlassyCard
            className="bg-transparent shadow-none w-full max-w-full py-0 px-0"
            icon={<UserIcon className="w-5 h-5 text-white" />}
            title="REGISTERED GUESTS"
            subColor="text-gray-600"
            titleColor="text-gray-900"
            iconBgColor="bg-gray-800"
          />
          <hr />
        </CardHeader>
        <CardContent className="px-4">
          <div className="mt-3 max-h-64 overflow-y-auto">
            {users && users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleUserClick(user)}
                    >
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 bg-black rounded-full">
                          <span className="text-white font-medium text-xs">
                            {getInitial(user.fname)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.fname} {user.lname}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {user.phone || "-"}
                      </TableCell>
                      <TableCell>
                        {user.role !== "USER" ? (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {user.role}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">User</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  No registered guests yet
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registration Dialogs */}
      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">
                  {selectedUser
                    ? `${selectedUser.fname} ${selectedUser.lname}`
                    : "User Details"}
                </h2>
                <p className="text-gray-600 text-sm">{selectedUser?.email}</p>
              </div>
            </DialogTitle>
            <DialogDescription>
              Manage user registrations and view details
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Information */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                  User Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Full Name
                      </span>
                      <p className="text-gray-900 font-medium">
                        {selectedUser.fname} {selectedUser.lname}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Email
                      </span>
                      <p className="text-gray-900 font-medium">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Phone
                      </span>
                      <p className="text-gray-900 font-medium">
                        {selectedUser.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Role
                      </span>
                      <p className="text-gray-900 font-medium">
                        {selectedUser.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Member Since
                      </span>
                      <p className="text-gray-900 font-medium">
                        {selectedUser.createdAt
                          ? new Date(
                              selectedUser.createdAt
                            ).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Registrations */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    Current Registrations ({userRegistrations.length})
                  </h3>
                </div>{" "}
                {userRegistrations.length > 0 ? (
                  <div className="grid gap-3">
                    {userRegistrations.map((registration) => (
                      <div
                        key={registration.id}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              {getActivityNameByTimeSlotId(
                                registration.timeSlotId
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              {getFormattedTimeSlotDetails(
                                registration.timeSlotId
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              Registered:{" "}
                              {registration.createdAt
                                ? new Date(
                                    registration.createdAt
                                  ).toLocaleDateString()
                                : "Unknown"}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (registration.id)
                                handleRemoveRegistration(registration.id);
                            }}
                            disabled={loading || !registration.id}
                            className="ml-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-gray-900 font-medium mb-2">
                      No registrations found
                    </h4>
                    <p className="text-sm text-gray-500">
                      This user has not registered for any activities yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    // Also close registration dialog if it's open
                    if (isRegisterDialogOpen) {
                      handleRegisterDialogClose();
                    }
                  }}
                  className="px-8 border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>

                <Button
                  onClick={() => {
                    // Open registration dialog for this user
                    setIsRegisterDialogOpen(true);
                  }}
                  className="bg-black hover:bg-gray-800 text-white px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register in Activity
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <EventSelectionDialog
        isOpen={isRegisterDialogOpen}
        onClose={handleRegisterDialogClose}
        onEventSelect={handleEventSelect}
        onRegister={handleRegisterUser}
        user={selectedUser}
        users={users || []}
        onUserSelect={(user) => setSelectedUser(user)}
        activities={activities || []}
        selectedActivity={selectedRegistrationActivity}
        selectedTimeSlot={selectedRegistrationTimeSlot}
        loading={loading}
      />

      <TimeSlotSelectionDialog
        isOpen={isTimeSlotDialogOpen}
        onClose={handleRegisterDialogClose}
        onTimeSlotSelect={handleRegistrationTimeSlotSelect}
        onBack={handleTimeSlotDialogBack}
        activity={selectedRegistrationActivity}
        timeSlots={registrationTimeSlots}
        loading={loading}
      />
    </>
  );
};

export default RegisteredGuests;
