import { useEffect, useState } from "react";
import { View, Pressable, Modal, TextInput, Dimensions } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  FadeInDown,
  ZoomIn,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import {
  Target,
  Coffee,
  Pause,
  Play,
  X,
  Brain,
  Zap,
} from "lucide-react-native";
import { COLORS } from "@/src/constants";
import { ROASTS } from "@/src/data/FocusSessionScreen";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = SCREEN_WIDTH * 0.75;
const STROKE_WIDTH = 8;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  progress: number;
  isBreak: boolean;
  isPaused: boolean;
}

function TimerDisplay({ minutes, seconds, progress, isBreak, isPaused }: TimerDisplayProps) {
  const animatedProgress = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  useEffect(() => {
    if (!isPaused) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
    }
  }, [isPaused]);

  const strokeDashoffset = useDerivedValue(() => {
    return CIRCUMFERENCE * (1 - animatedProgress.value);
  });

  const circleStyle = useAnimatedStyle(() => ({
    strokeDashoffset: strokeDashoffset.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const gradientColors = isBreak
    ? ["#22c55e", "#10b981"]
    : ["#3b82f6", "#8b5cf6"];

  return (
    <Animated.View style={containerStyle} className="items-center justify-center">
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
        </Defs>

        {/* Background Circle */}
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          stroke="#ffffff10"
          strokeWidth={STROKE_WIDTH}
          fill="transparent"
        />

        {/* Progress Circle */}
        <AnimatedCircle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          stroke="url(#progressGradient)"
          strokeWidth={STROKE_WIDTH}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          style={circleStyle}
          transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
        />
      </Svg>

      {/* Timer Text */}
      <View className="absolute items-center">
        <AppText
          className="text-7xl font-bold text-white tracking-tight"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </AppText>
        <View className="flex-row items-center gap-2 mt-2">
          {isBreak ? (
            <Coffee size={16} color="#22c55e" />
          ) : (
            <Target size={16} color="#3b82f6" />
          )}
          <AppText
            variant="label"
            color="secondary"
            className="uppercase tracking-widest"
          >
            {isBreak ? "Break Time" : "Deep Focus"}
          </AppText>
        </View>
      </View>
    </Animated.View>
  );
}

export default function FocusSessionScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse params
  const startTimeMs = params.startTime ? Number(params.startTime) : Date.now();
  const endTimeMs = params.endTime ? Number(params.endTime) : Date.now() + 25 * 60 * 1000;
  const totalDurationMs = endTimeMs - startTimeMs;

  // State
  const [remainingMs, setRemainingMs] = useState(endTimeMs - Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [showFriction, setShowFriction] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [roastIndex, setRoastIndex] = useState(0);
  const [currentBlock, setCurrentBlock] = useState({
    type: "focus" as "focus" | "break",
    title: "Deep Focus Block",
    index: 1,
    total: 3,
  });

  // Timer logic
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = endTimeMs - now;

      if (remaining <= 0) {
        clearInterval(interval);
        handleSessionComplete();
        return;
      }

      setRemainingMs(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, endTimeMs]);

  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const progress = 1 - remainingMs / totalDurationMs;

  const handleSessionComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(app)/(protected)/break");
  };

  const handleEndSession = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.replace("/(app)/(protected)/break");
  };

  const togglePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPaused(!isPaused);
  };

  const triggerFriction = () => {
    setRoastIndex(Math.floor(Math.random() * ROASTS.length));
    setChallengeAnswer("");
    setShowFriction(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {/* Ambient Background */}
      <View className="absolute inset-0">
        <View
          className="absolute top-1/4 left-1/2 w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            backgroundColor: currentBlock.type === "break" ? "#22c55e" : "#3b82f6",
            transform: [{ translateX: -200 }, { translateY: -200 }],
            shadowColor: currentBlock.type === "break" ? "#22c55e" : "#3b82f6",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 100,
          }}
        />
      </View>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(600)}
        className="px-6 flex-row items-center justify-between"
        style={{ paddingTop: top + 16 }}
      >
        <View className="flex-row items-center gap-3">
          <View className="bg-white/10 rounded-full px-4 py-2 flex-row items-center gap-2">
            <Zap size={14} color="#f59e0b" fill="#f59e0b" />
            <AppText variant="label" color="secondary">
              Block {currentBlock.index}/{currentBlock.total}
            </AppText>
          </View>
        </View>

        <Pressable
          onPress={triggerFriction}
          className="bg-white/5 rounded-full p-3"
        >
          <Brain size={20} color="#71717a" />
        </Pressable>
      </Animated.View>

      {/* Main Timer */}
      <View className="flex-1 items-center justify-center">
        <Animated.View entering={FadeIn.delay(400).duration(800)}>
          <TimerDisplay
            minutes={minutes}
            seconds={seconds}
            progress={progress}
            isBreak={currentBlock.type === "break"}
            isPaused={isPaused}
          />
        </Animated.View>

        {/* Current Task */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(600)}
          className="mt-8"
        >
          <View className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 items-center">
            <AppText variant="caption" color="tertiary" className="mb-1">
              Current Task
            </AppText>
            <AppText variant="h5">{currentBlock.title}</AppText>
          </View>
        </Animated.View>
      </View>

      {/* Controls */}
      <Animated.View
        entering={FadeInDown.delay(800).duration(600)}
        className="px-6 pb-6"
        style={{ paddingBottom: bottom + 24 }}
      >
        <View className="flex-row items-center justify-center gap-4">
          {/* End Session */}
          <Pressable
            onPress={handleEndSession}
            className="bg-red-500/10 border border-red-500/30 rounded-full p-4"
          >
            <X size={24} color="#ef4444" />
          </Pressable>

          {/* Pause/Resume */}
          <Pressable
            onPress={togglePause}
            className="bg-white rounded-full p-5"
            style={{
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
            }}
          >
            {isPaused ? (
              <Play size={32} color="#000" fill="#000" />
            ) : (
              <Pause size={32} color="#000" fill="#000" />
            )}
          </Pressable>

          {/* Placeholder for symmetry */}
          <View className="w-14 h-14" />
        </View>

        {isPaused && (
          <Animated.View
            entering={FadeIn.duration(300)}
            className="items-center mt-4"
          >
            <AppText variant="label" color="secondary">
              Session Paused
            </AppText>
          </Animated.View>
        )}
      </Animated.View>

      {/* Friction Modal with Roast */}
      <Modal visible={showFriction} transparent animationType="fade">
        <BlurView
          intensity={95}
          tint="dark"
          className="flex-1 items-center justify-center p-6"
        >
          <Animated.View
            entering={ZoomIn}
            className="bg-zinc-900 w-full p-8 rounded-[32px] border border-red-500/30 items-center"
          >
            <View className="bg-red-500/20 rounded-full p-4 mb-4">
              <AppText className="text-4xl">😠</AppText>
            </View>

            <AppText variant="h3" className="text-center mb-2" style={{ color: "#ef4444" }}>
              Stay Focused!
            </AppText>

            {/* Roasting Text */}
            <AppText
              variant="body"
              color="secondary"
              className="text-center mb-6 px-4"
            >
              "{ROASTS[roastIndex]}"
            </AppText>

            <View className="bg-white/5 rounded-2xl p-4 w-full mb-6">
              <AppText
                variant="caption"
                color="tertiary"
                className="mb-2 uppercase tracking-widest text-center"
              >
                Quick Math Challenge
              </AppText>
              <AppText variant="h2" className="text-center mb-4">
                12 × 4 = ?
              </AppText>

              <TextInput
                keyboardType="number-pad"
                className="bg-white/10 w-full p-4 rounded-xl text-center text-white text-xl font-bold border border-white/10"
                placeholder="Your answer"
                placeholderTextColor={COLORS.textTertiary}
                value={challengeAnswer}
                onChangeText={setChallengeAnswer}
                autoFocus
              />
            </View>

            <Pressable
              onPress={() => setShowFriction(false)}
              className="bg-white w-full py-4 rounded-2xl items-center"
            >
              <AppText className="text-black font-bold text-lg">
                Back to Focus
              </AppText>
            </Pressable>
          </Animated.View>
        </BlurView>
      </Modal>
    </View>
  );
}
