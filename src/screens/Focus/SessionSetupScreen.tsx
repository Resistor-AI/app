import { useEffect } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/src/components/atoms/GradientBackground";
import { SessionSetupHeader } from "./components/SessionSetupHeader";
import { TimeSelectionStep } from "./components/TimeSelectionStep";
import { AppSelectionStep } from "./components/AppSelectionStep/AppSelectionStep";
import { BrainDumpStep } from "./components/BrainDumpStep";
import { AISessionPlanningStep } from "./components/AISessionPlanningStep/AISessionPlanningStep";
import { SessionSetupFooter } from "./components/SessionSetupFooter";
import { StepAnimator } from "./components/StepAnimator";
import { useSessionSetup } from "@/src/hooks/focus/useSessionSetup";
import { useSessionBackHandler } from "@/src/hooks/focus/useSessionBackHandler";
import { formatDuration, formatTimeDisplay } from "@/src/lib/focus/formatters";

export default function SessionSetupScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const {
    step, totalSteps, stepDirection,
    startTime, endTime, setStartTime, setEndTime, durationMinutes,
    isStartTimeValid, isValidTimeRange, isFormValid,
    isLoadingApps, defaultBlockedApps, availableApps, selectedPackages,
    toggleApp, selectAllApps, deselectAllApps,
    brainDump, setBrainDump, hasBrainDump,
    generatedSchedule, isGeneratingSchedule, scheduleError,
    generateSchedule, reorderSchedule, regenerateSchedule,
    nextStep, prevStep, skipStep, goBack, startSession,
  } = useSessionSetup();

  const durationText = formatDuration(durationMinutes);
  useSessionBackHandler(step, prevStep);

  useEffect(() => {
    if (step === 4 && !generatedSchedule && !isGeneratingSchedule) generateSchedule();
  }, [step, generatedSchedule, isGeneratingSchedule, generateSchedule]);

  return (
    <GradientBackground>
      <StatusBar style="light" />
      <View style={{ height: top }} />
      <SessionSetupHeader step={step} totalSteps={totalSteps} onBack={goBack} onPrevStep={prevStep} />

      {step === 1 && (
        <StepAnimator stepKey="step-1" stepDirection={stepDirection} variant="scroll">
          <TimeSelectionStep
            startTime={startTime} endTime={endTime}
            onStartTimeChange={setStartTime} onEndTimeChange={setEndTime}
            isStartTimeValid={isStartTimeValid} isValidTimeRange={isValidTimeRange}
            isFormValid={isFormValid} durationText={durationText}
            formatTimeDisplay={formatTimeDisplay}
          />
        </StepAnimator>
      )}

      {step === 2 && (
        <StepAnimator stepKey="step-2" stepDirection={stepDirection} variant="view">
          <AppSelectionStep
            isLoading={isLoadingApps} defaultBlockedApps={defaultBlockedApps}
            availableApps={availableApps} selectedPackages={selectedPackages}
            onToggleApp={toggleApp} onSelectAll={selectAllApps}
            onDeselectAll={deselectAllApps} durationText={durationText}
          />
        </StepAnimator>
      )}

      {step === 3 && (
        <StepAnimator stepKey="step-3" stepDirection={stepDirection} variant="scroll">
          <BrainDumpStep
            brainDump={brainDump} onBrainDumpChange={setBrainDump}
            durationText={durationText} startTimeDisplay={formatTimeDisplay(startTime)}
          />
        </StepAnimator>
      )}

      {step === 4 && (
        <StepAnimator stepKey="step-4" stepDirection={stepDirection} variant="view" paddingBottom={120}>
          <AISessionPlanningStep
            schedule={generatedSchedule} isLoading={isGeneratingSchedule}
            error={scheduleError} onReorder={reorderSchedule}
            onRegenerateSchedule={regenerateSchedule} durationText={durationText}
            startTimeDisplay={formatTimeDisplay(startTime)} hasBrainDump={hasBrainDump}
          />
        </StepAnimator>
      )}

      <SessionSetupFooter
        step={step} isFormValid={isFormValid} hasBrainDump={hasBrainDump}
        isLoading={isGeneratingSchedule} onContinue={nextStep} onSkip={skipStep}
        onStartSession={startSession} bottomInset={bottom}
      />
    </GradientBackground>
  );
}
