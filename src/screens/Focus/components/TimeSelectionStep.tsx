import { memo } from "react";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import { Zap } from "lucide-react-native";
import { StepBadge } from "@/src/components/atoms/StepBadge";
import { TimeSelectionStepProps } from "@/src/types/Focus/SessionSetup";
import { TimePicker } from "./TimePicker";
import { DurationDisplay } from "./DurationDisplay";
import { TimeValidationError } from "./TimeValidationError";

export const TimeSelectionStep = memo(function TimeSelectionStep({
  startTime,
  endTime,
  isFormValid,
  durationText,
  onEndTimeChange,
  isStartTimeValid,
  isValidTimeRange,
  onStartTimeChange,
  formatTimeDisplay,
}: TimeSelectionStepProps) {
  return (
    <View>
      <StepBadge
        icon={<Zap size={14} color="#ffffff" fill="#ffffff" />}
        label="Set Your Focus Period"
        variant="white"
        className="mt-4 mb-8"
      />

      {/* Time Pickers */}
      <View className="gap-3 mb-6">
        <View className="overflow-hidden rounded-2xl border border-white/10">
          <BlurView intensity={25} tint="dark" style={{ padding: 20 }}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={onStartTimeChange}
            />
          </BlurView>
        </View>

        <View className="overflow-hidden rounded-2xl border border-white/10">
          <BlurView intensity={25} tint="dark" style={{ padding: 20 }}>
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={onEndTimeChange}
            />
          </BlurView>
        </View>
      </View>

      {/* Errors */}
      {!isStartTimeValid && (
        <TimeValidationError message="Start time cannot be in the past" />
      )}

      {isStartTimeValid && !isValidTimeRange && (
        <TimeValidationError message="End time must be after start time" />
      )}

      {/* Duration Display */}
      {isFormValid && (
        <DurationDisplay
          durationText={durationText}
          startTimeDisplay={formatTimeDisplay(startTime)}
          endTimeDisplay={formatTimeDisplay(endTime)}
        />
      )}
    </View>
  );
});
