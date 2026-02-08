import { memo } from "react";
import { View, TextInput, Pressable } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { TimePickerProps } from "@/src/types/Focus/SessionSetup";
import { useTimePicker } from "@/src/hooks/focus/useTimePicker";

export const TimePicker = memo(function TimePicker({
  value, onChange, label, className, onFocus, onBlur,
}: TimePickerProps) {
  const {
    hourText, minuteText, selectedPeriod, hourRef, minuteRef,
    handleHourChange, handleMinuteChange, handleHourBlur, handleMinuteBlur, togglePeriod,
  } = useTimePicker(value, onChange, onBlur);

  return (
    <View className={className}>
      <AppText variant="label" color="secondary" content={label} center className="uppercase tracking-widest mb-4" />
      <View className="flex-row items-center justify-center">
        <Pressable
          onPress={() => hourRef.current?.focus()}
          className="bg-white/5 border border-white/10 rounded-xl min-w-[64px] items-center justify-center"
        >
          <TextInput
            ref={hourRef} value={hourText} onChangeText={handleHourChange}
            onBlur={handleHourBlur} onFocus={onFocus} keyboardType="number-pad"
            maxLength={2} selectTextOnFocus className="text-3xl font-semibold text-white"
            style={{ textAlign: "center", width: 52, paddingVertical: 10 }} placeholderTextColor="#71717a"
          />
        </Pressable>
        <View className="mx-2 items-center">
          <View className="w-1.5 h-1.5 rounded-full bg-zinc-500 mb-1.5" />
          <View className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
        </View>
        <Pressable
          onPress={() => minuteRef.current?.focus()}
          className="bg-white/5 border border-white/10 rounded-xl min-w-[64px] items-center justify-center"
        >
          <TextInput
            ref={minuteRef} value={minuteText} onChangeText={handleMinuteChange}
            onBlur={handleMinuteBlur} onFocus={onFocus} keyboardType="number-pad"
            maxLength={2} selectTextOnFocus className="text-3xl font-semibold text-white"
            style={{ textAlign: "center", width: 52, paddingVertical: 10 }} placeholderTextColor="#71717a"
          />
        </Pressable>
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
