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
import { Activity } from "@/types/activities";
import { TimeSlot } from "@/types/timeslots";
import { Clock, ArrowLeft, Calendar, Users } from "lucide-react";
import { useRegStore } from "@/store/registeration";

interface TimeSlotSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  onBack: () => void;
  activity: Activity | null;
  timeSlots: TimeSlot[];
  loading?: boolean;
}

const formatTime = (timeString: string) => {
  try {
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    return timeString;
  } catch {
    return timeString;
  }
};

const TimeSlotSelectionDialog: React.FC<TimeSlotSelectionDialogProps> = ({
  isOpen,
  onClose,
  onTimeSlotSelect,
  onBack,
  activity,
  timeSlots,
  loading = false,
}) => {
  const { registrations, initializeSocketListeners } = useRegStore();

  React.useEffect(() => {
    if (isOpen) {
      initializeSocketListeners();
    }
  }, [isOpen, initializeSocketListeners]);

  const getLiveRegisteredCount = (timeSlotId: number) => {
    if (!registrations) return 0;
    return registrations.filter((reg) => reg.timeSlotId === timeSlotId).length;
  };

  const sortedTimeSlots = React.useMemo(() => {
    return [...timeSlots].sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [timeSlots]);

  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    onTimeSlotSelect(timeSlot);
    onBack(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-black rounded-full">
              <Clock className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Select Time Slot
              </h2>
              {activity && (
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Event: {activity.name}
                </p>
              )}
            </div>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Choose a time slot for this event
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Event Info */}
          {activity && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-700" />
                {activity.name}
              </h3>
              <p className="text-sm text-gray-600">{activity.description}</p>
            </div>
          )}

          {/* Time Slots Grid */}
          {sortedTimeSlots.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Available Time Slots
              </h3>
              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {sortedTimeSlots.map((timeSlot) => (
                    <div
                      key={timeSlot.id}
                      onClick={() => handleTimeSlotClick(timeSlot)}
                      className={`
                        relative p-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                        flex flex-col justify-center h-20 min-h-[7rem]
                        bg-white hover:bg-gray-50 
                        hover:border-black hover:shadow-md
                        border-gray-200 hover:scale-105
                        ${loading ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      <div className="text-center space-y-1">
                        <div className="text-sm font-bold text-gray-800">
                          {formatTime(timeSlot.startTime)}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          to
                        </div>
                        <div className="text-sm font-bold text-gray-800">
                          {formatTime(timeSlot.endTime)}
                        </div>
                        <div className="pt-1 border-t border-gray-200">
                          <div className="text-xs text-gray-600">
                            <span className="inline-flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {timeSlot.maxParticipants -
                                getLiveRegisteredCount(timeSlot.id)}{" "}
                              left
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 rounded-lg bg-black opacity-0 hover:opacity-5 transition-opacity duration-200"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Clock className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Time Slots Available
              </h3>
              <p className="text-gray-600">
                There are no time slots available for this event.
              </p>
            </div>
          )}
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Event Selection
            </Button>

            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotSelectionDialog;
