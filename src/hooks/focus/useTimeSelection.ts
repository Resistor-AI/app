import { useState, useMemo, useCallback } from "react";

export function useTimeSelection() {
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(
    new Date(Date.now() + 70 * 60 * 1000)
  );

  const handleEndTimeChange = useCallback((newEndTime: Date) => {
    if (newEndTime.getTime() <= startTime.getTime()) {
      const nextDay = new Date(newEndTime);
      nextDay.setDate(nextDay.getDate() + 1);
      setEndTime(nextDay);
    } else {
      const sameDayEnd = new Date(newEndTime);
      sameDayEnd.setFullYear(startTime.getFullYear());
      sameDayEnd.setMonth(startTime.getMonth());
      sameDayEnd.setDate(startTime.getDate());
      if (sameDayEnd.getTime() > startTime.getTime()) {
        setEndTime(sameDayEnd);
      } else {
        setEndTime(newEndTime);
      }
    }
  }, [startTime]);

  const handleStartTimeChange = useCallback((newStartTime: Date) => {
    setStartTime(newStartTime);
    if (endTime.getTime() <= newStartTime.getTime()) {
      setEndTime(new Date(newStartTime.getTime() + 60 * 60 * 1000));
    }
  }, [endTime]);

  const isStartTimeValid = useMemo(
    () => startTime.getTime() >= Date.now() - 60000, [startTime]
  );
  const isValidTimeRange = useMemo(
    () => endTime.getTime() > startTime.getTime(), [startTime, endTime]
  );
  const isFormValid = isStartTimeValid && isValidTimeRange;
  const durationMinutes = useMemo(() => {
    const diff = endTime.getTime() - startTime.getTime();
    return Math.max(0, Math.round(diff / (1000 * 60)));
  }, [startTime, endTime]);

  return {
    startTime, endTime,
    setStartTime: handleStartTimeChange,
    setEndTime: handleEndTimeChange,
    isStartTimeValid, isValidTimeRange, isFormValid, durationMinutes,
  };
}
