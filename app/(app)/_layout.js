import { Stack } from 'expo-router';
import { View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function AppLayout() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="index"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="portfolio" />
        <Stack.Screen name="cryptoanalysis" />
        <Stack.Screen name="analysis" />
        <Stack.Screen name="commission" />
        <Stack.Screen 
          name="[id]" 
          options={{
            gestureEnabled: true,
          }}
        />
      </Stack>
      <BottomTabBar />
    </View>
  );
}
