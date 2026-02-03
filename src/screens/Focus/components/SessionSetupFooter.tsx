import { memo } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingButton } from "@/src/screens/Onboarding/components/OnboardingButton";
import { SessionSetupFooterProps } from "@/src/types/Focus";

export const SessionSetupFooter = memo(function SessionSetupFooter({
  step,
  isFormValid,
  hasBrainDump,
  isLoading,
  onContinue,
  onSkip,
  onStartSession,
  bottomInset,
}: SessionSetupFooterProps) {
  const renderStepFooter = () => {
    switch (step) {
      // Step 1: Time Selection
      case 1:
        return (
          <OnboardingButton
            label="Continue"
            variant="blue"
            onPress={onContinue}
            disabled={!isFormValid}
            style={{ marginTop: 0, opacity: isFormValid ? 1 : 0.4 }}
          />
        );

      // Step 2: App Selection (skippable)
      case 2:
        return (
          <View>
            <OnboardingButton
              label="Continue"
              variant="blue"
              onPress={onContinue}
              style={{ marginTop: 0 }}
            />
            <Pressable onPress={onSkip} className="py-4 items-center">
              <AppText
                variant="label"
                color="secondary"
                content="Skip - Use My Defaults"
              />
            </Pressable>
          </View>
        );

      // Step 3: Brain Dump (optional)
      case 3:
        return (
          <View>
            <OnboardingButton
              label="Generate Schedule"
              variant="blue"
              onPress={onContinue}
              style={{ marginTop: 0 }}
            />
            <Pressable onPress={onSkip} className="py-4 items-center">
              <AppText
                variant="label"
                color="secondary"
                content={hasBrainDump ? "Skip Planning" : "Continue Without Tasks"}
              />
            </Pressable>
          </View>
        );

      // Step 4: AI Session Planning
      case 4:
        return (
          <View>
            {isLoading ? (
              <View className="bg-electricBlue/20 rounded-full py-4 items-center flex-row justify-center gap-3">
                <ActivityIndicator color="#3b82f6" />
                <AppText
                  variant="button"
                  color="blue"
                  content="Generating Schedule..."
                />
              </View>
            ) : (
              <OnboardingButton
                label="Start Focus Session"
                variant="green"
                showArrow={false}
                onPress={onStartSession}
                style={{ marginTop: 0 }}
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View
      className="absolute bottom-0 w-full px-6"
      style={{ paddingBottom: bottomInset + 16 }}
    >
      {renderStepFooter()}
    </View>
  );
});
