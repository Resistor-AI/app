import { useState, useCallback, useRef } from "react";
import * as Haptics from "expo-haptics";
import {
  FrictionStep,
  FRICTION_TOTAL_STEPS,
  FrictionContext,
  FrictionLog,
} from "@/src/types/Block/index";

export function useFrictionFlow(context: FrictionContext) {
  const [step, setStep] = useState<FrictionStep>(1);
  const startedAt = useRef(Date.now());
  const stepTimestamps = useRef<number[]>([Date.now()]);

  const advanceStep = useCallback(() => {
    if (step >= FRICTION_TOTAL_STEPS) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    stepTimestamps.current.push(Date.now());
    setStep((prev) => (prev + 1) as FrictionStep);
  }, [step]);

  const resetStep = useCallback(() => {
    setStep(1);
    startedAt.current = Date.now();
    stepTimestamps.current = [Date.now()];
  }, []);

  const buildLog = useCallback((): FrictionLog => {
    const now = Date.now();
    return {
      packageName: context.packageName,
      appName: context.appName,
      completedAt: now,
      totalDurationSeconds: Math.round((now - startedAt.current) / 1000),
    };
  }, [context]);

  return {
    step,
    totalSteps: FRICTION_TOTAL_STEPS,
    advanceStep,
    resetStep,
    buildLog,
  };
}
