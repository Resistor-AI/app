import { View, Pressable } from "react-native";
import { memo } from "react";
import Animated from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { Coffee } from "lucide-react-native";
import { ActiveCardActiveProps } from "@/src/types/Dashboard/ActiveCard";
import { ActiveCardHeader } from "./ActiveCardHeader";
import { ActiveCardTimer } from "./ActiveCardTimer";
import { BlockProgress } from "./BlockProgress";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ActiveCardActive = memo(function ActiveCardActive({
  config,
  displayTitle,
  priority,
  isBreak,
  currentBlock,
  totalBlocks,
  isWaitingToStart,
  timeLeft,
  progress,
  entryStyle,
  pressStyle,
  pulseStyle,
  glowStyle,
  onPress,
  onPressIn,
  onPressOut,
  breakCount = 0,
}: ActiveCardActiveProps) {
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[entryStyle, pressStyle]}
      className="mr-4 w-[200px] bg-zinc-900 rounded-3xl p-5 h-48 border relative overflow-hidden"
    >
      {/* Border glow effect */}
      <View
        style={{ borderColor: config.border }}
        className="absolute inset-0 rounded-3xl border-2"
      />

      {/* Background glow orb */}
      <Animated.View
        style={[glowStyle, { backgroundColor: config.glow }]}
        className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full"
      />

      <ActiveCardHeader
        config={config}
        priority={priority}
        isBreak={isBreak}
        isWaitingToStart={isWaitingToStart}
        pulseStyle={pulseStyle}
      />

      {/* Title */}
      <AppText
        className="text-white text-base font-bold leading-5 tracking-tight mb-1"
        numberOfLines={2}
      >
        {displayTitle}
      </AppText>

      {/* Block progress + break count */}
      <View className="flex-row items-center justify-between">
        <BlockProgress
          currentBlock={currentBlock}
          totalBlocks={totalBlocks}
          accent={config.accent}
          isWaitingToStart={isWaitingToStart}
        />
        {breakCount > 0 && !isBreak && (
          <View className="flex-row items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: `${config.accent}15` }}>
            <Coffee size={9} color={config.accent} style={{ opacity: 0.6 }} />
            <AppText style={{ color: config.accent, opacity: 0.6 }} className="text-[10px] font-bold">
              {breakCount} {breakCount === 1 ? "break" : "breaks"}
            </AppText>
          </View>
        )}
      </View>

      {/* Spacer */}
      <View className="flex-1" />

      <ActiveCardTimer
        isWaitingToStart={isWaitingToStart}
        timeLeft={timeLeft}
        progress={progress}
        accent={config.accent}
      />
    </AnimatedPressable>
  );
});
