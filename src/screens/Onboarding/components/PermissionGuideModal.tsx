import { useRef, useEffect, useMemo, useCallback } from "react";
import { View, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingButton } from "./OnboardingButton";

interface PermissionGuideModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  description: string | string[];
  onClose: () => void;
  onAction: () => void;
  actionLabel?: string;
  icon?: string;
}

export function PermissionGuideModal({
  visible,
  title,
  subtitle,
  description,
  onClose,
  onAction,
  actionLabel = "Open Settings",
  icon = "⚙️",
}: PermissionGuideModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%", "65%"], []);

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
        enableTouchThrough={false}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1} // Default directly to the larger snap point for content
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: "rgba(24, 24, 27, 0.95)", // Zinc-900 with opacity
        borderRadius: 32,
      }}
      handleIndicatorStyle={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        width: 40,
      }}
      enablePanDownToClose
    >
      <BottomSheetView className="p-6 pb-10 items-center flex-1">
        <View className="w-full items-center mb-6">
          <AppText className="text-4xl mb-3">{icon}</AppText>
          <AppText variant="h3" center className="mb-2">
            {title}
          </AppText>

          {subtitle && (
            <AppText variant="body" color="secondary" center className="mb-4">
              {subtitle}
            </AppText>
          )}

          {Array.isArray(description) ? (
            <View className="self-center w-auto max-w-[90%]">
              {description.map((item, index) => (
                <View key={index} className="flex-row mb-2 pr-2">
                  <AppText className="mr-2 text-sm leading-5">•</AppText>
                  <AppText
                    variant="body"
                    color="secondary"
                    className="leading-5 shrink text-sm"
                  >
                    {item}
                  </AppText>
                </View>
              ))}
            </View>
          ) : (
            <AppText
              variant="body"
              color="secondary"
              center
              className="leading-6"
            >
              {description}
            </AppText>
          )}
        </View>

        <View className="w-full gap-4 mt-auto">
          <OnboardingButton
            label={actionLabel}
            variant="purple"
            showArrow={false}
            onPress={onAction}
            className="mt-0"
          />

          <Pressable
            onPress={() => bottomSheetModalRef.current?.dismiss()}
            className="items-center py-3"
          >
            <AppText variant="body" className="text-white">
              Cancel
            </AppText>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
