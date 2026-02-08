import { View, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { ROLES } from "@/src/constants/data";
import { RoleSelectorProps } from "@/src/types/Onboarding/components";

export function RoleSelector({ selectedRole, onSelect }: RoleSelectorProps) {
  return (
    <View>
      <AppText className="text-white/50 mb-3 text-sm font-outfit-medium uppercase tracking-wider">
        What best describes you?
      </AppText>
      <View className="flex-row flex-wrap gap-3">
        {ROLES.map((role) => (
          <TouchableOpacity
            key={role}
            onPress={() => { Haptics.selectionAsync(); onSelect(role); }}
            className={`px-5 py-3 rounded-xl border ${
              selectedRole === role ? "bg-amber/20 border-amber" : "bg-white/5 border-white/10"
            }`}
          >
            <AppText className={`${selectedRole === role ? "text-amber" : "text-white/70"} font-outfit-medium`}>
              {role}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
