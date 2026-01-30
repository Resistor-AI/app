import { View, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingHeader, OnboardingButton, OnboardingStepper } from "./components";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { useState } from "react";
import Animated, { FadeInUp } from "react-native-reanimated";

const ROLES = [
  "Student",
  "Professional",
  "Entrepreneur",
  "Creative",
  "Developer",
  "Other",
];

export default function UserDetailsScreen() {
  const router = useRouter();
  const { name, description, setName, setDescription } = useOnboardingStore();
  const [localName, setLocalName] = useState(name);
  const [localDesc, setLocalDesc] = useState(description);

  const handleContinue = async () => {
    if (!localName.trim() || !localDesc) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setName(localName);
    setDescription(localDesc);
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("./permissions");
  };

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />
      <View className="px-7">
        <OnboardingStepper totalSteps={6} currentStep={3} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 px-7 mt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <OnboardingHeader
            title={"Let's Get to Know\n You 👋"}
            subtitle="To personalize your experience."
            subTitleClassName="text-4xl"
            accentColor="amberLight"
          />

          <View className="mt-10 gap-8">
            {/* Name Input */}
            <View>
              <AppText className="text-white/50 mb-3 text-sm font-outfit-medium uppercase tracking-wider">
                What should we call you?
              </AppText>
              <TextInput
                value={localName}
                onChangeText={setLocalName}
                placeholder="Your Name"
                placeholderTextColor="rgba(255,255,255,0.2)"
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-outfit-medium text-lg"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Description Selection */}
            <View>
              <AppText className="text-white/50 mb-3 text-sm font-outfit-medium uppercase tracking-wider">
                What best describes you?
              </AppText>
              <View className="flex-row flex-wrap gap-3">
                {ROLES.map((role, index) => (
                  <TouchableOpacity
                    key={role}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setLocalDesc(role);
                    }}
                    className={`px-5 py-3 rounded-xl border ${
                      localDesc === role
                        ? "bg-amber/20 border-amber"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <AppText
                      className={`${
                        localDesc === role ? "text-amber" : "text-white/70"
                      } font-outfit-medium`}
                    >
                      {role}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View className="h-6" />
        </ScrollView>
      </KeyboardAvoidingView>

      <Animated.View 
        entering={FadeInUp.delay(300).springify()}
        className="px-7 pb-10"
      >
        <OnboardingButton
          label="Continue"
          variant="amber"
          onPress={handleContinue}
          style={{
            opacity: (!localName.trim() || !localDesc) ? 0.5 : 1,
            marginTop: 0
          }}
          disabled={!localName.trim() || !localDesc}
        />
      </Animated.View>
    </View>
  );
}
