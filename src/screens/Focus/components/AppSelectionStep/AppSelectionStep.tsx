import { memo } from "react";
import { View, ActivityIndicator } from "react-native";
import Animated, { FadeOut, SlideInRight } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Smartphone } from "lucide-react-native";
import { FlashList } from "@shopify/flash-list";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants/colors";
import { AppSelectionStepProps, ListItem } from "@/src/types/Focus/AppSelectionStep";
import { AppItem } from "./AppItem";
import { AppSelectionHeader } from "./AppSelectionHeader";

export const AppSelectionStep = memo(function AppSelectionStep({
  isLoading, defaultBlockedApps, availableApps, selectedPackages,
  onToggleApp, onSelectAll, onDeselectAll, durationText,
}: AppSelectionStepProps) {
  const selectedCount = selectedPackages.size;
  const totalCount = defaultBlockedApps.length + availableApps.length;
  const flatData: ListItem[] = [];

  if (defaultBlockedApps.length > 0) {
    flatData.push({ type: "header", title: "Your Defaults" });
    defaultBlockedApps.forEach((app) => {
      flatData.push({ type: "app", data: app, isSelected: selectedPackages.has(app.packageName) });
    });
  }
  if (availableApps.length > 0) {
    flatData.push({ type: "header", title: "Add More Apps" });
    availableApps.forEach((app) => {
      flatData.push({ type: "app", data: app, isSelected: selectedPackages.has(app.packageName) });
    });
  }

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === "header") {
      return (
        <View className="py-2 mb-2 mt-4">
          <AppText variant="label" color="secondary" content={item.title.toUpperCase()} className="tracking-wider" />
        </View>
      );
    }
    return <AppItem app={item.data} isSelected={item.isSelected} onToggle={onToggleApp} />;
  };

  return (
    <Animated.View entering={SlideInRight.duration(250)} exiting={FadeOut.duration(150)} className="flex-1">
      <AppSelectionHeader
        selectedCount={selectedCount} totalCount={totalCount}
        durationText={durationText} onSelectAll={onSelectAll} onDeselectAll={onDeselectAll}
      />
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.electricBlue} />
          <AppText variant="body-sm" color="tertiary" content="Loading apps..." className="mt-4" />
        </View>
      )}
      {!isLoading && (
        <View className="flex-1 overflow-hidden rounded-2xl border border-white/10">
          <BlurView intensity={20} tint="dark" style={{ flex: 1, padding: 16 }}>
            {flatData.length > 0 ? (
              <FlashList
                data={flatData}
                renderItem={renderItem}
                getItemType={(item) => item.type}
                showsVerticalScrollIndicator={false}
                extraData={selectedPackages}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <View className="bg-zinc-800 rounded-full p-4 mb-4">
                  <Smartphone size={32} color="#71717a" />
                </View>
                <AppText variant="body" color="secondary" content="No apps available" center />
              </View>
            )}
          </BlurView>
        </View>
      )}
    </Animated.View>
  );
});
