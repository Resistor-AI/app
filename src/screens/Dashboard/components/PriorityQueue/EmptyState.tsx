import { View } from "react-native";
import { Coffee } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";

export const EmptyState = () => {
  return (
    <View className="mb-10 w-full px-6">
      <View className="flex-row items-center justify-between mb-4 pl-1">
        <AppText content="Priority Queue" variant="overline" />
      </View>
      <View className="w-full h-52 items-center justify-center opacity-50">
        <View className="w-16 h-16 bg-zinc-900 rounded-full items-center justify-center mb-4 border border-zinc-800">
          <Coffee size={24} color="#71717a" />
        </View>
        <AppText variant="body" color="primary" content="All Caught Up" />
        <AppText
          variant="body-sm"
          color="secondary"
          className="text-center mt-1"
          content={`No active sessions queued.\nEnjoy your free time!`}
        />
      </View>
    </View>
  );
};
