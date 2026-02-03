import { memo } from "react";
import { View, Pressable, Image, Switch, ActivityIndicator } from "react-native";
import Animated, { FadeOut, SlideInRight, FadeIn } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Shield, Smartphone } from "lucide-react-native";
import { FlashList } from "@shopify/flash-list";
import { AppText } from "@/src/components/atoms/text";
import { StepBadge } from "@/src/components/atoms/StepBadge";
import { useAppIcon } from "@/src/hooks/useInstalledApps";
import { COLORS } from "@/src/constants";
import { AppInfo as NativeAppInfo } from "@/modules/installed-apps";

interface AppSelectionStepProps {
  isLoading: boolean;
  defaultBlockedApps: NativeAppInfo[];
  availableApps: NativeAppInfo[];
  selectedPackages: Set<string>;
  onToggleApp: (packageName: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  durationText: string;
}

interface AppItemProps {
  app: NativeAppInfo;
  isSelected: boolean;
  onToggle: (packageName: string) => void;
}

const AppItem = memo(function AppItem({ app, isSelected, onToggle }: AppItemProps) {
  const { data: icon } = useAppIcon(app.packageName);

  return (
    <Animated.View entering={FadeIn}>
      <View className="flex-row items-center p-3 rounded-xl border mb-2 bg-white/5 border-white/10">
        {icon ? (
          <Image
            source={{ uri: `data:image/png;base64,${icon}` }}
            className="size-10 rounded-lg"
            fadeDuration={300}
          />
        ) : (
          <View className="w-10 h-10 rounded-lg bg-white/10 items-center justify-center">
            <AppText className="text-xl uppercase">{app.label.charAt(0)}</AppText>
          </View>
        )}

        <AppText variant="body" className="flex-1 ml-3">
          {app.label}
        </AppText>

        <Switch
          value={isSelected}
          onValueChange={() => onToggle(app.packageName)}
          trackColor={{ false: "#3e3e3e", true: COLORS.electricBlue }}
          thumbColor="#fff"
        />
      </View>
    </Animated.View>
  );
});

type ListItem =
  | { type: "header"; title: string }
  | { type: "app"; data: NativeAppInfo; isSelected: boolean };

export const AppSelectionStep = memo(function AppSelectionStep({
  isLoading,
  defaultBlockedApps,
  availableApps,
  selectedPackages,
  onToggleApp,
  onSelectAll,
  onDeselectAll,
  durationText,
}: AppSelectionStepProps) {
  const selectedCount = selectedPackages.size;
  const totalCount = defaultBlockedApps.length + availableApps.length;

  // Build flat list data
  const flatData: ListItem[] = [];

  if (defaultBlockedApps.length > 0) {
    flatData.push({ type: "header", title: "Your Defaults" });
    defaultBlockedApps.forEach((app) => {
      flatData.push({
        type: "app",
        data: app,
        isSelected: selectedPackages.has(app.packageName),
      });
    });
  }

  if (availableApps.length > 0) {
    flatData.push({ type: "header", title: "Add More Apps" });
    availableApps.forEach((app) => {
      flatData.push({
        type: "app",
        data: app,
        isSelected: selectedPackages.has(app.packageName),
      });
    });
  }

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === "header") {
      return (
        <View className="py-2 mb-2 mt-4">
          <AppText
            variant="label"
            color="secondary"
            content={item.title.toUpperCase()}
            className="tracking-wider"
          />
        </View>
      );
    }
    return (
      <AppItem
        app={item.data}
        isSelected={item.isSelected}
        onToggle={onToggleApp}
      />
    );
  };

  return (
    <Animated.View
      entering={SlideInRight.duration(250)}
      exiting={FadeOut.duration(150)}
      className="flex-1"
    >
      <StepBadge
        icon={<Shield size={14} color="#22c55e" fill="#22c55e" />}
        label="Block Distractions"
        variant="green"
        className="mt-4 mb-6"
      />

      {/* Title */}
      <View className="mb-4">
        <AppText
          variant="h3"
          content="Which apps should be blocked?"
          center
          className="mb-2"
        />
        <AppText
          variant="body-sm"
          color="tertiary"
          center
          content={`${selectedCount} of ${totalCount} apps selected for ${durationText}`}
        />
      </View>

      {/* Quick Actions */}
      <View className="flex-row justify-center gap-3 mb-4">
        <Pressable
          onPress={onSelectAll}
          className="bg-white/5 border border-white/10 rounded-full px-4 py-2"
        >
          <AppText variant="label" color="secondary" content="Select All" />
        </Pressable>
        <Pressable
          onPress={onDeselectAll}
          className="bg-white/5 border border-white/10 rounded-full px-4 py-2"
        >
          <AppText variant="label" color="secondary" content="Defaults Only" />
        </Pressable>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.electricBlue} />
          <AppText
            variant="body-sm"
            color="tertiary"
            content="Loading apps..."
            className="mt-4"
          />
        </View>
      )}

      {/* App List */}
      {!isLoading && (
        <View className="flex-1 overflow-hidden rounded-2xl border border-white/10">
          <BlurView intensity={20} tint="dark" style={{ flex: 1, padding: 16 }}>
            {flatData.length > 0 ? (
              <FlashList
                data={flatData}
                renderItem={renderItem}
                getItemType={(item) => item.type}
                estimatedItemSize={60}
                showsVerticalScrollIndicator={false}
                extraData={selectedPackages}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <View className="bg-zinc-800 rounded-full p-4 mb-4">
                  <Smartphone size={32} color="#71717a" />
                </View>
                <AppText
                  variant="body"
                  color="secondary"
                  content="No apps available"
                  center
                />
              </View>
            )}
          </BlurView>
        </View>
      )}
    </Animated.View>
  );
});
