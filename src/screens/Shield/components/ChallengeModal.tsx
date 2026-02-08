import { Modal, View, TextInput, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import Animated, { ZoomIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants/colors";
import { ChallengeModalProps } from "@/src/types/Shield/components";

export function ChallengeModal({
  visible, answer, onChangeAnswer, onVerify, onClose,
}: ChallengeModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={90} tint="dark" className="flex-1 items-center justify-center p-6">
        <Animated.View
          entering={ZoomIn}
          className="bg-[#1A1A1A] w-full p-8 rounded-[32px] border border-white/10 items-center"
        >
          <AppText className="text-4xl mb-4">🛑</AppText>
          <AppText variant="h3" className="text-center mb-2">Wait a second.</AppText>
          <AppText color="secondary" className="text-center mb-8">
            Solve this to unlock distractions.
          </AppText>
          <AppText variant="h1" className="mb-8 text-5xl font-mono">7 + 7 = ?</AppText>
          <TextInput
            keyboardType="number-pad"
            className="bg-white/5 w-full p-4 rounded-xl text-center text-white text-2xl font-bold border border-white/10 mb-6"
            placeholder="Answer" placeholderTextColor={COLORS.textTertiary}
            value={answer} onChangeText={onChangeAnswer} autoFocus
          />
          <Pressable onPress={onVerify} className="bg-white w-full py-4 rounded-xl items-center mb-4">
            <AppText className="text-black font-bold">Unlock</AppText>
          </Pressable>
          <Pressable onPress={onClose} className="py-2">
            <AppText color="secondary">I'll get back to work</AppText>
          </Pressable>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}
