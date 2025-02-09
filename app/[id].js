import React from 'react';
import { Stack } from 'expo-router';
import CryptoDetailScreen from './screens/CryptoDetailScreen';

export default function CryptoDetail() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          presentation: 'modal'
        }} 
      />
      <CryptoDetailScreen />
    </>
  );
}
