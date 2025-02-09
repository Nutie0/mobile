import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Market',
      icon: 'trending-up',
      route: '/',
    },
    {
      name: 'Portfolio',
      icon: 'pie-chart',
      route: '/portfolio',
    },
    {
      name: 'CryptoAnalysis',
      icon: 'activity',
      route: '/cryptoanalysis',
    },
    {
      name: 'Analysis',
      icon: 'bar-chart-2',
      route: '/analysis',
    },
    {
      name: 'Commission',
      icon: 'percent',
      route: '/commission',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={[styles.tab, pathname === tab.route && styles.activeTab]}
          onPress={() => router.push(tab.route)}
        >
          <Feather
            name={tab.icon}
            size={22}
            color={pathname === tab.route ? '#2ECC71' : '#666'}
          />
          <Text
            style={[
              styles.tabText,
              { color: pathname === tab.route ? '#2ECC71' : '#666' },
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#333',
    height: 65,
    paddingBottom: 8,
    paddingTop: 5,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#333',
  },
  tabText: {
    fontSize: 11,
    marginTop: 4,
  },
});
