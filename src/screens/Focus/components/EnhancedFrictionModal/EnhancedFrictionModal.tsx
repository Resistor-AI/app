import { useEffect, useMemo } from "react";
import { View, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusSessionStore } from "@/src/store/focusSessionStore";
import { useFrictionFlow } from "@/src/hooks/block/useFrictionFlow";
import { FrictionContext } from "@/src/types/Block/index";
import { EnhancedFrictionModalProps } from "@/src/types/Focus/EnhancedFrictionModal";
import { OnboardingButton } from "@/src/screens/Onboarding/components/OnboardingButton";
import { StepAnimator } from "@/src/screens/Focus/components/StepAnimator";
import { FrictionHeader } from "@/src/screens/Block/components/FrictionHeader";
import { ReflectiveStep } from "@/src/screens/Block/components/ReflectiveStep/ReflectiveStep";
import { ChallengeStep } from "@/src/screens/Block/components/ChallengeStep/ChallengeStep";
import { JustificationStep } from "@/src/screens/Block/components/JustificationStep";
import { HoldButtonStep } from "@/src/screens/Block/components/HoldButtonStep/HoldButtonStep";
import { AccessGrantedStep } from "@/src/screens/Block/components/AccessGrantedStep";

function useEndSessionContext(): FrictionContext {
  const currentBlock = useFocusSessionStore((s) => s.getCurrentBlock)();
  const schedule = useFocusSessionStore((s) => s.activeSchedule);

  const remainingMinutes = useMemo(() => {
    if (!schedule) return 0;
    const endTime = new Date(schedule.schedule.at(-1)?.endTime ?? "");
    return Math.max(0, Math.round((endTime.getTime() - Date.now()) / 60_000));
  }, [schedule]);

  return {
    mode: "end_session",
    appName: "quitting",
    packageName: "end_session",
    taskName: currentBlock?.block.title ?? "your session",
    remainingMinutes,
  };
}

export function EnhancedFrictionModal({
  visible, onClose, onConfirmExit,
}: EnhancedFrictionModalProps) {
  const context = useEndSessionContext();
  const { step, advanceStep, resetStep } = useFrictionFlow(context);

  useEffect(() => {
    if (visible) resetStep();
  }, [visible, resetStep]);

  return (
    <Modal visible={visible} animationType="fade">
      <SafeAreaView className="flex-1 bg-background">
        {step < 5 && (
          <FrictionHeader currentStep={step} onReturnToFocus={onClose} />
        )}

        <StepAnimator
          stepKey={`end-friction-${step}`}
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
              mode="end_session"
              onComplete={advanceStep}
            />
          )}
          {step === 4 && <HoldButtonStep onComplete={advanceStep} />}
          {step === 5 && (
            <AccessGrantedStep context={context} onUnlock={onConfirmExit} />
          )}
        </StepAnimator>

        {step < 5 && (
          <View className="px-6 pb-4">
            <OnboardingButton
              label="Return to Focus"
              variant="white"
              showArrow={false}
              onPress={onClose}
              style={{ marginTop: 0 }}
            />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
