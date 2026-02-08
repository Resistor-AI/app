import { useEffect, useMemo, useCallback } from "react";
import { View, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import InstalledApps from "@/modules/installed-apps";
import { useInstalledApps } from "@/src/hooks/useInstalledApps";
import { useFocusSessionStore } from "@/src/store/focusSessionStore";
import { useFrictionFlow } from "@/src/hooks/block/useFrictionFlow";
import { BlockScreenProps } from "@/src/types/BlockScreen";
import { FrictionContext } from "@/src/types/Block/index";
import { OnboardingButton } from "@/src/screens/Onboarding/components/OnboardingButton";
import { StepAnimator } from "@/src/screens/Focus/components/StepAnimator";
import { FrictionHeader } from "./components/FrictionHeader";
import { ReflectiveStep } from "./components/ReflectiveStep/ReflectiveStep";
import { ChallengeStep } from "./components/ChallengeStep/ChallengeStep";
import { JustificationStep } from "./components/JustificationStep";
import { HoldButtonStep } from "./components/HoldButtonStep/HoldButtonStep";
import { AccessGrantedStep } from "./components/AccessGrantedStep";

function useBlockContext(blockedPackage?: string): FrictionContext {
  const { data: sections } = useInstalledApps();
  const currentBlock = useFocusSessionStore((s) => s.getCurrentBlock)();
  const schedule = useFocusSessionStore((s) => s.activeSchedule);

  const appName = useMemo(
    () =>
      sections
        ?.flatMap((s) => s.data)
        .find((a) => a.packageName === blockedPackage)?.label ?? "This app",
    [sections, blockedPackage],
  );

  const remainingMinutes = useMemo(() => {
    if (!schedule) return 0;
    const endTime = new Date(schedule.schedule.at(-1)?.endTime ?? "");
    return Math.max(0, Math.round((endTime.getTime() - Date.now()) / 60_000));
  }, [schedule]);

  return {
    mode: "block" as const,
    appName,
    packageName: blockedPackage ?? "unknown",
    taskName: currentBlock?.block.title ?? "your session",
    remainingMinutes,
  };
}

export default function BlockScreen({ blockedPackage }: BlockScreenProps) {
  const router = useRouter();
  const context = useBlockContext(blockedPackage);
  const incrementAttempt = useFocusSessionStore((s) => s.incrementDistractionAttempt);
  const logFriction = useFocusSessionStore((s) => s.logFrictionComplete);
  const { step, advanceStep, buildLog } = useFrictionFlow(context);

  useEffect(() => {
    incrementAttempt(context.packageName);
  }, []);

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/(app)/(protected)/focus");
  }, [router]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [goBack]);

  const handleUnlock = useCallback(() => {
    logFriction(buildLog());
    InstalledApps.snoozeApp(context.packageName, 2);
    InstalledApps.launchApp(context.packageName);
  }, [context.packageName, logFriction, buildLog]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {step < 5 && (
        <FrictionHeader currentStep={step} onReturnToFocus={goBack} />
      )}

      <StepAnimator
        stepKey={`friction-${step}`}
        stepDirection="forward"
        variant="view"
        paddingBottom={100}
      >
        {step === 1 && (
          <ReflectiveStep context={context} onComplete={advanceStep} />
        )}
        {step === 2 && <ChallengeStep onComplete={advanceStep} />}
        {step === 3 && (
          <JustificationStep
            appName={context.appName}
            mode={context.mode}
            onComplete={advanceStep}
          />
        )}
        {step === 4 && <HoldButtonStep onComplete={advanceStep} />}
        {step === 5 && (
          <AccessGrantedStep context={context} onUnlock={handleUnlock} />
        )}
      </StepAnimator>

      {step < 5 && (
        <View className="px-6 pb-4">
          <OnboardingButton
            label="Return to Focus"
            variant="white"
            showArrow={false}
            onPress={goBack}
            style={{ marginTop: 0 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
