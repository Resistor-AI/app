import { useState, useCallback } from "react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StepNumber, TOTAL_STEPS } from "@/src/types/Focus";

export function useSessionNavigation() {
  const router = useRouter();
  const [step, setStep] = useState<StepNumber>(1);
  const [stepDirection, setStepDirection] = useState<"forward" | "back">("forward");

  const nextStep = useCallback(() => {
    if (step < TOTAL_STEPS) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStepDirection("forward");
      setStep((prev) => (prev + 1) as StepNumber);
    }
  }, [step]);

  const prevStep = useCallback(() => {
    if (step > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStepDirection("back");
      setStep((prev) => (prev - 1) as StepNumber);
    }
  }, [step]);

  const skipStep = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStepDirection("forward");
    setStep((prev) => (prev + 1) as StepNumber);
  }, []);

  const goBack = useCallback(() => router.back(), [router]);

  return {
    step, stepDirection, totalSteps: TOTAL_STEPS,
    nextStep, prevStep, skipStep, goBack, router,
  };
}
