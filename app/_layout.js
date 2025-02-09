import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import BottomTabBar from './components/BottomTabBar';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Slot />
        <BottomTabBar />
      </View>
    </GestureHandlerRootView>
  );
}
