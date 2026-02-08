import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { PERMISSIONS } from "@/src/constants/data";
import { OnboardingHeader } from "./components/OnboardingHeader";
import { OnboardingButton } from "./components/OnboardingButton";
import { OnboardingSubtext } from "./components/OnboardingSubtext";
import { OnboardingStepper } from "./components/OnboardingStepper";
import { PermissionGuideModal } from "./components/PermissionGuideModal";
import { usePermissionsLogic } from "@/src/hooks/usePermissionsLogic";
import { PermissionRow } from "./components/PermissionRow";
import { PermissionKey } from "@/src/types/Onboarding/PermissionsScreen";

export default function PermissionsScreen() {
  const {
    modalConfig,
    modalVisible,
    canContinue,
    isRequesting,
    handleContinue,
    setModalVisible,
    permissionStates,
    handlePermissionPress,
  } = usePermissionsLogic();

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />

      {/* Top Section */}
      <View className="px-7">
        <OnboardingStepper totalSteps={6} currentStep={4} />
      </View>

      <View className="flex-1 px-7 pb-10 justify-between mt-6">
        <View>
          <Animated.View entering={FadeIn.delay(200).duration(800)}>
            <OnboardingHeader
              className="-mb-8"
              title="Give Us"
              subtitle="The Shield."
              accentColor="deepPurple"
            />

            <OnboardingSubtext className="mt-4">
              Tap each permission to enable. These help Resistor protect your
              focus.
            </OnboardingSubtext>
          </Animated.View>

          <View className="gap-4 mt-12">
            {PERMISSIONS.map((perm, index) => (
              <PermissionRow
                key={perm.key}
                title={perm.title}
                desc={perm.desc}
                icon={perm.icon}
                permissionKey={perm.key as PermissionKey}
                status={permissionStates[perm.key as PermissionKey]}
                index={index}
                onPress={handlePermissionPress}
                disabled={
                  isRequesting ||
                  permissionStates[perm.key as PermissionKey] === "granted"
                }
              />
            ))}
          </View>
        </View>

        <Animated.View
          entering={FadeInUp.delay(1200).duration(600).springify()}
          className="gap-5"
        >
          <OnboardingButton
            label={canContinue ? "Continue" : "Enable Permissions"}
            variant="purple"
            onPress={handleContinue}
          />
        </Animated.View>
      </View>

      <PermissionGuideModal
        visible={modalVisible}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        description={modalConfig.description}
        icon={modalConfig.icon}
        onAction={modalConfig.onAction}
        actionLabel={modalConfig.actionLabel}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
