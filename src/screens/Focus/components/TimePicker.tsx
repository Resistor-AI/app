import { memo, useState, useCallback, useEffect, useRef } from "react";
import { View, TextInput, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { TimePickerProps } from "@/src/types/Focus";

export const TimePicker = memo(function TimePicker({
  value,
  onChange,
  label,
  className,
  onFocus,
  onBlur,
}: TimePickerProps) {
  const hours24 = value.getHours();
  const minutes = value.getMinutes();
  const isPM = hours24 >= 12;

  const displayHour = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;

  const [hourText, setHourText] = useState(displayHour.toString());
  const [minuteText, setMinuteText] = useState(minutes.toString().padStart(2, "0"));
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(isPM ? "PM" : "AM");

  const hourRef = useRef<TextInput>(null);
  const minuteRef = useRef<TextInput>(null);

  // Only sync from external value changes, not from our own updates
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

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
      let hours24 = hour;

      if (period === "PM" && hour !== 12) {
        hours24 = hour + 12;
      } else if (period === "AM" && hour === 12) {
        hours24 = 0;
      }

      newDate.setHours(hours24);
      newDate.setMinutes(minute);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);

      isInternalUpdate.current = true;
      onChange(newDate);
    },
    [value, onChange]
  );

  const handleHourChange = useCallback((text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, "");
    setHourText(cleaned);

    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      updateTime(num, parseInt(minuteText, 10) || 0, selectedPeriod);
    }
  }, [minuteText, selectedPeriod, updateTime]);

  const handleMinuteChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 2) {
      setMinuteText(cleaned);

      const num = parseInt(cleaned, 10);
      if (!isNaN(num) && num >= 0 && num <= 59) {
        updateTime(parseInt(hourText, 10) || 12, num, selectedPeriod);
      }
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

  return (
    <View className={className}>
      <AppText
        variant="label"
        color="secondary"
        content={label}
        center
        className="uppercase tracking-widest mb-4"
      />

      <View className="flex-row items-center justify-center">
        {/* Hour Input */}
        <Pressable
          onPress={() => hourRef.current?.focus()}
          className="bg-white/5 border border-white/10 rounded-xl min-w-[64px] items-center justify-center"
        >
          <TextInput
            ref={hourRef}
            value={hourText}
            onChangeText={handleHourChange}
            onBlur={handleHourBlur}
            onFocus={onFocus}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            className="text-3xl font-semibold text-white"
            style={{ textAlign: "center", width: 52, paddingVertical: 10 }}
            placeholderTextColor="#71717a"
          />
        </Pressable>

        <View className="mx-2 items-center">
          <View className="w-1.5 h-1.5 rounded-full bg-zinc-500 mb-1.5" />
          <View className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
        </View>

        {/* Minute Input */}
        <Pressable
          onPress={() => minuteRef.current?.focus()}
          className="bg-white/5 border border-white/10 rounded-xl min-w-[64px] items-center justify-center"
        >
          <TextInput
            ref={minuteRef}
            value={minuteText}
            onChangeText={handleMinuteChange}
            onBlur={handleMinuteBlur}
            onFocus={onFocus}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            className="text-3xl font-semibold text-white"
            style={{ textAlign: "center", width: 52, paddingVertical: 10 }}
            placeholderTextColor="#71717a"
          />
        </Pressable>

        {/* AM/PM Toggle */}
        <Pressable
          onPress={togglePeriod}
          className="ml-2 bg-white/5 border border-white/10 rounded-xl min-w-[64px] items-center justify-center"
          style={{ paddingVertical: 10 }}
        >
          <AppText variant="h2" content={selectedPeriod} />
        </Pressable>
      </View>
    </View>
  );
});
