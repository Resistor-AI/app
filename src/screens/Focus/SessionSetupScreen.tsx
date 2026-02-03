import { useEffect } from "react";
import { View, ScrollView, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import Animated, {
  SlideInRight,
  SlideInLeft,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { GradientBackground } from "@/src/components/atoms/GradientBackground";
import { SessionSetupHeader } from "./components/SessionSetupHeader";
import { TimeSelectionStep } from "./components/TimeSelectionStep";
import { AppSelectionStep } from "./components/AppSelectionStep";
import { BrainDumpStep } from "./components/BrainDumpStep";
import { AISessionPlanningStep } from "./components/AISessionPlanningStep";
import { SessionSetupFooter } from "./components/SessionSetupFooter";
import { useSessionSetup } from "@/src/hooks/focus";
import { formatDuration, formatTimeDisplay } from "@/src/lib/focus";

export default function SessionSetupScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const {
    // Step state
    step,
    totalSteps,
    stepDirection,

    // Time state
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    durationMinutes,

    // Validation
    isStartTimeValid,
    isValidTimeRange,
    isFormValid,

    // App selection
    isLoadingApps,
    defaultBlockedApps,
    availableApps,
    selectedPackages,
    toggleApp,
    selectAllApps,
    deselectAllApps,

    // Brain dump
    brainDump,
    setBrainDump,
    hasBrainDump,

    // Schedule
    generatedSchedule,
    isGeneratingSchedule,
    scheduleError,
    generateSchedule,
    reorderSchedule,
    regenerateSchedule,

    // Navigation
    nextStep,
    prevStep,
    skipStep,
    goBack,
    startSession,
  } = useSessionSetup();

  const durationText = formatDuration(durationMinutes);
  const navigation = useNavigation();

  // Handle hardware/gesture back button
  useEffect(() => {
    const handleBackPress = () => {
      if (step > 1) {
        prevStep();
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior (go back to dashboard)
    };

    // Android hardware back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    // iOS swipe gesture - prevent it when not on step 1
    // Only intercept POP actions (back gesture), not REPLACE/PUSH
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (step > 1 && e.data.action.type === "POP") {
        e.preventDefault();
        prevStep();
      }
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [step, prevStep, navigation]);

  // Generate schedule when entering step 4
  useEffect(() => {
    if (step === 4 && !generatedSchedule && !isGeneratingSchedule) {
      generateSchedule();
    }
  }, [step, generatedSchedule, isGeneratingSchedule, generateSchedule]);

  const handleContinue = () => {
    nextStep();
  };

  const handleSkip = () => {
    skipStep();
  };

  return (
    <GradientBackground>
      <StatusBar style="light" />
      <View style={{ height: top }} />

      <SessionSetupHeader
        step={step}
        totalSteps={totalSteps}
        onBack={goBack}
        onPrevStep={prevStep}
      />

      {/* Step 1: Time Selection */}
      {step === 1 && (
        <Animated.ScrollView
          key="step-1"
          entering={stepDirection === "forward" ? SlideInRight.duration(250) : SlideInLeft.duration(250)}
          exiting={stepDirection === "forward" ? SlideOutLeft.duration(150) : SlideOutRight.duration(150)}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 200,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
        >
          <TimeSelectionStep
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            isStartTimeValid={isStartTimeValid}
            isValidTimeRange={isValidTimeRange}
            isFormValid={isFormValid}
            durationText={durationText}
            formatTimeDisplay={formatTimeDisplay}
          />
        </Animated.ScrollView>
      )}

      {/* Step 2: App Selection */}
      {step === 2 && (
        <Animated.View
          key="step-2"
          entering={stepDirection === "forward" ? SlideInRight.duration(250) : SlideInLeft.duration(250)}
          exiting={stepDirection === "forward" ? SlideOutLeft.duration(150) : SlideOutRight.duration(150)}
          className="flex-1 px-6"
          style={{ paddingBottom: 200 }}
        >
          <AppSelectionStep
            isLoading={isLoadingApps}
            defaultBlockedApps={defaultBlockedApps}
            availableApps={availableApps}
            selectedPackages={selectedPackages}
            onToggleApp={toggleApp}
            onSelectAll={selectAllApps}
            onDeselectAll={deselectAllApps}
            durationText={durationText}
          />
        </Animated.View>
      )}

      {/* Step 3: Brain Dump */}
      {step === 3 && (
        <Animated.ScrollView
          key="step-3"
          entering={stepDirection === "forward" ? SlideInRight.duration(250) : SlideInLeft.duration(250)}
          exiting={stepDirection === "forward" ? SlideOutLeft.duration(150) : SlideOutRight.duration(150)}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 200,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
        >
          <BrainDumpStep
            brainDump={brainDump}
            onBrainDumpChange={setBrainDump}
            durationText={durationText}
            startTimeDisplay={formatTimeDisplay(startTime)}
          />
        </Animated.ScrollView>
      )}

      {/* Step 4: AI Session Planning */}
      {step === 4 && (
        <Animated.View
          key="step-4"
          entering={stepDirection === "forward" ? SlideInRight.duration(250) : SlideInLeft.duration(250)}
          exiting={stepDirection === "forward" ? SlideOutLeft.duration(150) : SlideOutRight.duration(150)}
          className="flex-1 px-6"
          style={{ paddingBottom: 120 }}
        >
          <AISessionPlanningStep
            schedule={generatedSchedule}
            isLoading={isGeneratingSchedule}
            error={scheduleError}
            onReorder={reorderSchedule}
            onRegenerateSchedule={regenerateSchedule}
            durationText={durationText}
            startTimeDisplay={formatTimeDisplay(startTime)}
            hasBrainDump={hasBrainDump}
          />
        </Animated.View>
      )}

      <SessionSetupFooter
        step={step}
        isFormValid={isFormValid}
        hasBrainDump={hasBrainDump}
        isLoading={isGeneratingSchedule}
        onContinue={handleContinue}
        onSkip={handleSkip}
        onStartSession={startSession}
        bottomInset={bottom}
      />
    </GradientBackground>
  );
}
