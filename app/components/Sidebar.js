import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import TransactionModal from './TransactionModal';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.7;
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function Sidebar({ isOpen, onClose, navigation }) {
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const translateX = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const menuItems = [
    {
      icon: 'repeat',
      label: 'Transactions',
      onPress: () => setIsTransactionModalVisible(true),
    },
    {
      icon: 'settings',
      label: 'Settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'bar-chart-2',
      label: 'Analyse',
      onPress: () => navigation.navigate('Analysis'),
    },
  ];

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.overlayBackground} />
        </TouchableOpacity>
      )}
      
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX }],
            paddingTop: STATUSBAR_HEIGHT,
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Feather name="shield" size={24} color="#2ECC71" />
              <Text style={styles.logoText}>User 001</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  item.onPress();
                  if (item.label !== 'Transactions') {
                    onClose();
                  }
                }}
              >
                <Feather name={item.icon} size={20} color="#FFF" />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => {
                navigation.navigate('Login');
                onClose();
              }}
            >
              <Feather name="log-out" size={20} color="#FF4444" />
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      <TransactionModal
        visible={isTransactionModalVisible}
        onClose={() => setIsTransactionModalVisible(false)}
        navigation={navigation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#2A2A2A',
    zIndex: 150,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  menuItemText: {
    color: '#FFF',
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 16,
  },
});
