import React from 'react';
import { Stack } from 'expo-router';
import PortfolioScreen from './screens/PortfolioScreen';

export default function Portfolio() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PortfolioScreen />
    </>
  );
}
