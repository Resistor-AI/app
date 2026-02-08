import { View } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { SelectableAppItem } from "./SelectableAppItem";
import { AppListItemProps } from "@/src/types/Onboarding/AppSelectionScreen";

export function AppListItem({ item, selectedPackages, onToggle }: AppListItemProps) {
  if (item.type === "header") {
    return (
      <View className="bg-background py-2 mb-2 mt-4">
        <AppText variant="h4" className="text-white/50 uppercase text-xs tracking-wider font-bold">
          {item.title}
        </AppText>
      </View>
    );
  }
  return (
    <SelectableAppItem
      app={item.data}
      isSelected={selectedPackages.has(item.data.packageName)}
      onToggle={onToggle}
    />
  );
}
