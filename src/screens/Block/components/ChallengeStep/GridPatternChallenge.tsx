import { useState, useMemo, useEffect } from "react";
import { View, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants/colors";
import { GridPatternChallengeProps } from "@/src/types/Block/components";

function GridView({
  gridSize,
  activeCells,
  selectedCells,
  interactive,
  onToggle,
}: {
  gridSize: number;
  activeCells: Set<number>;
  selectedCells?: Set<number>;
  interactive: boolean;
  onToggle?: (idx: number) => void;
}) {
  const cells = Array.from({ length: gridSize * gridSize }, (_, i) => i);

  const getCellColor = (idx: number): string => {
    if (!interactive && activeCells.has(idx)) return "#FFFFFF";
    if (interactive && selectedCells?.has(idx)) return "#FFFFFF";
    return "rgba(255,255,255,0.06)";
  };

  return (
    <View className="items-center">
      {Array.from({ length: gridSize }, (_, row) => (
        <View key={row} className="flex-row gap-2 mb-2">
          {cells.slice(row * gridSize, (row + 1) * gridSize).map((idx) => (
            <Pressable
              key={idx}
              onPress={interactive ? () => onToggle?.(idx) : undefined}
              className="size-16 rounded-xl"
              style={{ backgroundColor: getCellColor(idx) }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export function GridPatternChallengeView({
  challenge,
  phase,
  onSuccess,
  onFail,
}: GridPatternChallengeProps) {
  const activeSet = useMemo(
    () => new Set(challenge.activeCells),
    [challenge.activeCells],
  );
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (phase === "memorize") setSelected(new Set());
  }, [phase]);

  const handleToggle = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleSubmit = () => {
    if (selected.size !== activeSet.size) return onFail();
    const match = [...activeSet].every((c) => selected.has(c));
    match ? onSuccess() : onFail();
  };

  if (phase === "memorize") {
    return (
      <Animated.View entering={FadeIn.duration(300)} className="items-center">
        <AppText variant="body-sm" color="secondary" className="mb-4">
          Memorize the pattern
        </AppText>
        <GridView
          gridSize={challenge.gridSize}
          activeCells={activeSet}
          interactive={false}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(300)} className="items-center">
      <AppText variant="body-sm" color="secondary" className="mb-4">
        Recreate the pattern ({selected.size} selected)
      </AppText>
      <GridView
        gridSize={challenge.gridSize}
        activeCells={activeSet}
        selectedCells={selected}
        interactive
        onToggle={handleToggle}
      />
      <Pressable
        onPress={handleSubmit}
        disabled={selected.size === 0}
        className="mt-5 rounded-full py-4 px-12 items-center"
        style={{
          backgroundColor: selected.size > 0
            ? "#FFFFFF"
            : "rgba(255,255,255,0.05)",
        }}
      >
        <AppText variant="body" className="font-semibold" style={{ color: "#050505" }}>
          Submit
        </AppText>
      </Pressable>
    </Animated.View>
  );
}
