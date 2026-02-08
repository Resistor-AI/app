import { useState, useEffect, useRef } from "react";
import { View, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants/colors";
import { ColorSequenceChallengeProps } from "@/src/types/Block/components";
import { ChallengeColor } from "@/src/types/Block/challenges";

function MemorizePhase({
  colors,
  flashMs,
}: {
  colors: string[];
  flashMs: number;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setActiveIdx(0);
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => Math.min(prev + 1, colors.length));
    }, flashMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [colors.length, flashMs]);

  return (
    <Animated.View entering={FadeIn.duration(300)} className="items-center">
      <AppText variant="body-sm" color="secondary" className="mb-6">
        Memorize the color sequence
      </AppText>
      <View
        className="size-24 rounded-full items-center justify-center"
        style={{
          backgroundColor:
            activeIdx < colors.length ? colors[activeIdx] : "rgba(255,255,255,0.05)",
        }}
      />
      <AppText variant="body-sm" color="tertiary" className="mt-4">
        {Math.min(activeIdx + 1, colors.length)} / {colors.length}
      </AppText>
    </Animated.View>
  );
}

function SelectedDots({ selected }: { selected: string[] }) {
  return (
    <View className="flex-row gap-2 mb-4 min-h-[24px] justify-center">
      {selected.map((hex, i) => (
        <View
          key={i}
          className="size-5 rounded-full"
          style={{ backgroundColor: hex }}
        />
      ))}
    </View>
  );
}

function RecallPhase({
  palette,
  selected,
  targetCount,
  onSelect,
  onSubmit,
}: {
  palette: ChallengeColor[];
  selected: string[];
  targetCount: number;
  onSelect: (hex: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(300)}>
      <AppText variant="body-sm" color="secondary" className="mb-4 text-center">
        Tap colors in the correct order ({selected.length}/{targetCount})
      </AppText>
      <SelectedDots selected={selected} />
      <View className="flex-row flex-wrap justify-center gap-3">
        {palette.map((c) => (
          <Pressable
            key={c.hex}
            onPress={() => onSelect(c.hex)}
            className="size-14 rounded-full"
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </View>
      {selected.length === targetCount && (
        <Pressable
          onPress={onSubmit}
          className="mt-5 rounded-full py-4 items-center"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <AppText variant="body" className="font-semibold" style={{ color: "#050505" }}>
            Submit
          </AppText>
        </Pressable>
      )}
    </Animated.View>
  );
}

export function ColorSequenceChallengeView({
  challenge,
  phase,
  palette,
  onSuccess,
  onFail,
}: ColorSequenceChallengeProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (phase === "memorize") setSelected([]);
  }, [phase]);

  const handleSelect = (hex: string) => {
    if (selected.length >= challenge.colors.length) return;
    setSelected((prev) => [...prev, hex]);
  };

  const handleSubmit = () => {
    const match = challenge.colors.every((c, i) => c === selected[i]);
    match ? onSuccess() : onFail();
  };

  if (phase === "memorize") {
    return <MemorizePhase colors={challenge.colors} flashMs={challenge.flashMs} />;
  }

  return (
    <RecallPhase
      palette={palette}
      selected={selected}
      targetCount={challenge.colors.length}
      onSelect={handleSelect}
      onSubmit={handleSubmit}
    />
  );
}
