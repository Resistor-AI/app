import { useRouter } from "expo-router";
import { View, Pressable, TextInput, ScrollView } from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";
import { useState } from "react";
import { AppText } from "@/src/components/atoms/text";
import { COLORS, USER_ROLES } from "@/src/constants";
import { OnboardingButton } from "../Onboarding/components";

export default function UserInfoScreen() {
  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!name.trim() || !selectedRole) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: Save user info
    router.replace("/(app)/(protected)");
  };

  const handleRoleSelect = async (roleId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRole(roleId);
  };

  const isValid = name.trim().length > 0 && selectedRole !== null;

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />

      {/* Main Content */}
      <View
        className="flex-1 px-6"
        style={{ paddingTop: top + 40, paddingBottom: bottom + 16 }}
      >
        {/* Centered Content */}
        <View className="flex-1 justify-center">
          {/* Greeting */}
          <Animated.View entering={FadeIn.delay(100).duration(600)}>
            <AppText className="text-5xl mb-2">👋</AppText>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <AppText variant="display">Let's Get Familiar!</AppText>

            <AppText
              variant="display"
              className="leading-[3rem] my-4"
              style={{ color: COLORS.successGreen }}
            >
              What's your name?
            </AppText>
          </Animated.View>

          {/* Name Input */}
          <Animated.View entering={FadeInUp.delay(400).duration(500)}>
            <BlurView
              intensity={60}
              tint="dark"
              className="rounded-full overflow-hidden border border-white/20 mt-4"
            >
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={COLORS.textTertiary}
                className="px-5 py-4 text-xl text-textPrimary"
                autoCapitalize="words"
                autoCorrect={false}
                autoFocus
              />
            </BlurView>
          </Animated.View>

          {/* Role Selection */}
          <Animated.View
            entering={FadeInUp.delay(600).duration(500)}
            className="mt-10"
          >
            <AppText variant="body-lg" color="secondary" className="my-4">
              I'm a...
            </AppText>
          </Animated.View>
          {/* Role Pills - Horizontal Scroll */}
          <Animated.View entering={FadeInUp.delay(700).duration(500)}>
            <ScrollView horizontal className="gap-x-4">
              {USER_ROLES.map((role, index) => (
                <Animated.View
                  key={role.id}
                  entering={ZoomIn.delay(800 + index * 60)
                    .duration(300)
                    .springify()}
                >
                  <Pressable
                    onPress={() => handleRoleSelect(role.id)}
                    className="mr-4"
                  >
                    <BlurView
                      intensity={60}
                      tint="dark"
                      className={`rounded-full overflow-hidden border ${
                        selectedRole === role.id
                          ? "border-successGreen"
                          : "border-white/20"
                      }`}
                    >
                      <View
                        className="flex-row items-center gap-2 px-5 py-3"
                        style={{
                          backgroundColor:
                            selectedRole === role.id
                              ? `${COLORS.successGreen}25`
                              : "transparent",
                        }}
                      >
                        <AppText className="text-xl">{role.icon}</AppText>
                        <AppText
                          variant="h6"
                          className={
                            selectedRole === role.id
                              ? "text-successGreen"
                              : "text-textPrimary"
                          }
                        >
                          {role.label}
                        </AppText>
                      </View>
                    </BlurView>
                  </Pressable>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        </View>

        {/* Continue Button */}

        <OnboardingButton
          disabled={!isValid}
          onPress={handleContinue}
          variant="green"
          label="Let's Go! 🚀"
          showArrow={false}
        />
      </View>
    </View>
  );
}
