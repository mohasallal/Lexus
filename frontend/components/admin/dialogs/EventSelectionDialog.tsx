"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "@/types/activities";
import { User } from "@/types/auth";
import {
  Calendar,
  Clock,
  User as UserIcon,
  X,
  CheckCircle2,
} from "lucide-react";

interface EventSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEventSelect: (activity: Activity) => void;
  onRegister?: () => void; // Made optional for view-only mode
  user?: User | null;
  users?: User[];
  onUserSelect?: (user: User) => void;
  activities: Activity[];
  selectedActivity?: Activity | null;
  selectedTimeSlot?: {
    id: number;
    startTime: string;
    endTime: string;
  } | null;
  loading?: boolean;
  viewMode?: boolean; // Add view mode flag
}

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

const EventSelectionDialog: React.FC<EventSelectionDialogProps> = ({
  isOpen,
  onClose,
  onEventSelect,
  onRegister,
  user,
  users = [],
  onUserSelect,
  activities,
  selectedActivity,
  selectedTimeSlot,
  loading = false,
  viewMode = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-black rounded-full">
              <Calendar className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {viewMode
                  ? "View Event Registrations"
                  : "Register User in Event"}
              </h2>
              {user && !viewMode && (
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Registering: {user.fname} {user.lname}
                </p>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            {viewMode
              ? "Select an event to view registered users"
              : "Select an event and time slot to register the user"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 p-6 pt-0">
          {/* User Selection (if no user pre-selected) */}
          {!viewMode && !user && users.length > 0 && onUserSelect && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Select User to Register
              </h3>
              <div className="grid gap-2 max-h-48 overflow-y-auto">
                {users.map((userOption) => (
                  <Card
                    key={userOption.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-gray-50 border-gray-200"
                    onClick={() => onUserSelect(userOption)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-black rounded-full">
                          <span className="text-white font-medium text-sm">
                            {userOption.fname.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {userOption.fname} {userOption.lname}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {userOption.email}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Event Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Event
            </h3>
            <div className="grid gap-3">
              {activities.map((activity) => (
                <Card
                  key={activity.id}
                  className={`
                    cursor-pointer transition-all duration-200 hover:shadow-md py-0
                    ${
                      selectedActivity?.id === activity.id
                        ? "ring-2 ring-black bg-gray-50 border-gray-400"
                        : "hover:bg-gray-50 border-gray-200"
                    }
                  `}
                  onClick={() => onEventSelect(activity)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {activity.name}
                        </h4>
                        {activity.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {activity.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {activity.createdAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Created:{" "}
                              {new Date(
                                activity.createdAt
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8">
                        {selectedActivity?.id === activity.id ? (
                          <CheckCircle2 className="w-5 h-5 text-black" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Selected Time Slot Display */}
          {selectedActivity && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Selected Event:{" "}
                <span className="text-gray-900">{selectedActivity.name}</span>
              </h3>

              {selectedTimeSlot && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Time Slot:</span>
                  <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-md border border-gray-200">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {formatTime(selectedTimeSlot.startTime)} -{" "}
                      {formatTime(selectedTimeSlot.endTime)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            <div className="flex gap-3">
              {selectedActivity && (
                <Button
                  variant="outline"
                  onClick={() => onEventSelect(selectedActivity)}
                  disabled={loading}
                  className="border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Select Time
                </Button>
              )}

              {!viewMode && onRegister && (
                <Button
                  onClick={onRegister}
                  disabled={
                    !user || !selectedActivity || !selectedTimeSlot || loading
                  }
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {loading ? (
                    <>Registering...</>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Register
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventSelectionDialog;
