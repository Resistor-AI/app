import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useNavigation } from "expo-router";
import { StepNumber } from "@/src/types/Focus";

export function useSessionBackHandler(step: StepNumber, prevStep: () => void) {
  const navigation = useNavigation();

  useEffect(() => {
    const handleBackPress = () => {
      if (step > 1) {
        prevStep();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

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
}
