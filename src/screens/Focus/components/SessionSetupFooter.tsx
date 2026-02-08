import { memo } from "react";
import { View, Pressable } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingButton } from "@/src/screens/Onboarding/components/OnboardingButton";
import { SessionSetupFooterProps } from "@/src/types/Focus/SessionSetup";

export const SessionSetupFooter = memo(function SessionSetupFooter({
  step, isFormValid, hasBrainDump, isLoading,
  onContinue, onSkip, onStartSession, bottomInset,
}: SessionSetupFooterProps) {
  const skipLabel = step === 2
    ? "Skip - Use My Defaults"
    : hasBrainDump ? "Skip Planning" : "Continue Without Tasks";

  return (
    <View className="absolute bottom-0 w-full px-6" style={{ paddingBottom: bottomInset + 16 }}>
      {step === 1 && (
        <OnboardingButton
          label="Continue" variant="white" onPress={onContinue}
          disabled={!isFormValid} style={{ marginTop: 0, opacity: isFormValid ? 1 : 0.4 }}
        />
      )}
      {(step === 2 || step === 3) && (
        <View>
          <OnboardingButton
            label={step === 3 ? "Generate Schedule" : "Continue"}
            variant="white" onPress={onContinue} style={{ marginTop: 0 }}
          />
          <Pressable onPress={onSkip} className="py-4 items-center">
            <AppText variant="label" color="secondary" content={skipLabel} />
          </Pressable>
        </View>
      )}
      {step === 4 && (
        <OnboardingButton
          label={isLoading ? "AI is thinking..." : "Start Focus Session"}
          variant="white" showArrow={false} onPress={onStartSession}
          disabled={isLoading}
          style={{ marginTop: 0, opacity: isLoading ? 0.4 : 1 }}
        />
      )}
    </View>
  );
});
