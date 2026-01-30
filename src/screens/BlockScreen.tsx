import React, { useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/src/components/atoms/text';
import { Button } from '@/src/components/atoms/button';
import { BlockScreenProps } from '@/src/types/BlockScreen';

export default function BlockScreen({ blockedPackage }: BlockScreenProps) {
  
  // Safety: Prevent back button from doing anything (Native activity also handles this)
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return true means "We handled it, do nothing default"
      // Ideally, we want to minimize the app here.
      BackHandler.exitApp(); 
      return true;
    });
    return () => subscription.remove();
  }, []);

  const handleGoHome = () => {
    BackHandler.exitApp();
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-600 items-center justify-center p-6">
      <View className="items-center w-full max-w-sm space-y-8">
        
        {/* ICON */}
        <View className="bg-white/20 p-8 rounded-full mb-4">
          <AppText className="text-6xl">🛡️</AppText>
        </View>

        {/* HEADINGS */}
        <View className="items-center space-y-2">
          <AppText variant="h2" className="text-white text-center font-bold">
            Access Denied
          </AppText>
          
          <AppText variant="body-lg" className="text-white/90 text-center font-medium px-4">
            {blockedPackage 
              ? `You are trying to open ${blockedPackage}` 
              : "This app is currently blocked."}
          </AppText>
        </View>

        {/* SUBTEXT */}
        <AppText variant="body" className="text-white/70 text-center px-4 leading-6">
          You are currently in a Focus Session. Stay on track!
        </AppText>

        {/* ACTIONS */}
        <View className="w-full space-y-4 pt-4">
          <Button 
            onPress={handleGoHome}
            className="bg-white w-full rounded-2xl shadow-sm"
            textClassName="text-amber-600 font-bold text-lg"
            size="lg"
          >
            Go Home
          </Button>

          <Button 
            variant="ghost" 
            className="active:bg-amber-700/20"
            textClassName="text-white/80 underline"
            onPress={() => alert("Challenges coming soon!")}
          >
            Emergency Unlock
          </Button>
        </View>

      </View>
    </SafeAreaView>
  );
}
