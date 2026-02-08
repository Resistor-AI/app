import { useState, useCallback, useEffect, useRef } from "react";
import { TextInput } from "react-native";
import * as Haptics from "expo-haptics";

export function useTimePicker(
  value: Date,
  onChange: (date: Date) => void,
  onBlur?: () => void,
) {
  const hours24 = value.getHours();
  const isPM = hours24 >= 12;
  const displayHour = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;

  const [hourText, setHourText] = useState(displayHour.toString());
  const [minuteText, setMinuteText] = useState(value.getMinutes().toString().padStart(2, "0"));
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(isPM ? "PM" : "AM");
  const hourRef = useRef<TextInput>(null);
  const minuteRef = useRef<TextInput>(null);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (isInternalUpdate.current) { isInternalUpdate.current = false; return; }
    const h24 = value.getHours();
    const m = value.getMinutes();
    const pm = h24 >= 12;
    const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
    setHourText(h12.toString());
    setMinuteText(m.toString().padStart(2, "0"));
    setSelectedPeriod(pm ? "PM" : "AM");
  }, [value]);

  const updateTime = useCallback(
    (hour: number, minute: number, period: "AM" | "PM") => {
      const newDate = new Date(value);
      let h24 = hour;
      if (period === "PM" && hour !== 12) h24 = hour + 12;
      else if (period === "AM" && hour === 12) h24 = 0;
      newDate.setHours(h24);
      newDate.setMinutes(minute);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      isInternalUpdate.current = true;
      onChange(newDate);
    },
    [value, onChange],
  );

  const handleHourChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setHourText(cleaned);
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num >= 1 && num <= 12)
      updateTime(num, parseInt(minuteText, 10) || 0, selectedPeriod);
  }, [minuteText, selectedPeriod, updateTime]);

  const handleMinuteChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 2) {
      setMinuteText(cleaned);
      const num = parseInt(cleaned, 10);
      if (!isNaN(num) && num >= 0 && num <= 59)
        updateTime(parseInt(hourText, 10) || 12, num, selectedPeriod);
    }
  }, [hourText, selectedPeriod, updateTime]);

  const handleHourBlur = useCallback(() => {
    let num = parseInt(hourText, 10);
    if (isNaN(num) || num < 1) num = 12;
    if (num > 12) num = 12;
    setHourText(num.toString());
    updateTime(num, parseInt(minuteText, 10) || 0, selectedPeriod);
    onBlur?.();
  }, [hourText, minuteText, selectedPeriod, updateTime, onBlur]);

  const handleMinuteBlur = useCallback(() => {
    let num = parseInt(minuteText, 10);
    if (isNaN(num) || num < 0) num = 0;
    if (num > 59) num = 59;
    setMinuteText(num.toString().padStart(2, "0"));
    updateTime(parseInt(hourText, 10) || 12, num, selectedPeriod);
    onBlur?.();
  }, [hourText, minuteText, selectedPeriod, updateTime, onBlur]);

  const togglePeriod = useCallback(() => {
    Haptics.selectionAsync();
    const newPeriod = selectedPeriod === "AM" ? "PM" : "AM";
    setSelectedPeriod(newPeriod);
    updateTime(parseInt(hourText, 10) || 12, parseInt(minuteText, 10) || 0, newPeriod);
  }, [hourText, minuteText, selectedPeriod, updateTime]);

  return {
    hourText, minuteText, selectedPeriod,
    hourRef, minuteRef,
    handleHourChange, handleMinuteChange,
    handleHourBlur, handleMinuteBlur, togglePeriod,
  };
}
