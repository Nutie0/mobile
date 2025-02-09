import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { 
  useFonts,
  Orbitron_700Bold,
} from '@expo-google-fonts/orbitron';
import Sidebar from '../components/Sidebar';

// Mock data for cryptocurrencies
const cryptoData = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '45,083.52',
    change: '+2.83',
    icon: 'BTC',
    color: '#F7931A'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    price: '2,312.15',
    change: '+1.45',
    icon: 'ETH',
    color: '#627EEA'
  },
  {
    id: 'bnb',
    name: 'Binance Coin',
    symbol: 'BNB',
    price: '305.82',
    change: '-0.75',
    icon: 'BNB',
    color: '#F3BA2F'
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    price: '95.47',
    change: '+4.21',
    icon: 'SOL',
    color: '#00FFA3'
  },
  {
    id: 'ada',
    name: 'Cardano',
    symbol: 'ADA',
    price: '1.23',
    change: '-1.02',
    icon: 'ADA',
    color: '#0033AD'
  },
];

export default function CryptoListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(cryptoData);
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fontsLoaded] = useFonts({
    Orbitron_700Bold,
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = cryptoData.filter(crypto =>
      crypto.name.toLowerCase().includes(query.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuVisible(!isProfileMenuVisible);
    Animated.timing(menuAnimation, {
      toValue: isProfileMenuVisible ? 0 : 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderCryptoItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cryptoItem}
      onPress={() => router.push(`/${item.id}`)}
    >
      <View style={styles.cryptoInfo}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Text style={styles.cryptoIcon}>{item.icon}</Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.cryptoName}>{item.name}</Text>
          <Text style={styles.cryptoSymbol}>{item.symbol}</Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={[
          styles.change,
          { color: item.change.startsWith('+') ? '#2ECC71' : '#E74C3C' }
        ]}>
          {item.change}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={toggleSidebar}
          >
            <Feather name="menu" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Feather name="trending-up" size={24} color="#2ECC71" />
            </View>
            <Text style={styles.title}>CryptoWallet</Text>
          </View>

          <TouchableOpacity 
            style={styles.profileButton}
            onPress={toggleProfileMenu}
          >
            <Feather name="user" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une crypto..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {isProfileMenuVisible && (
        <Animated.View 
          style={[
            styles.profileMenu,
            {
              opacity: menuAnimation,
              transform: [{ translateY: menuAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }) }],
            },
          ]}
        >
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="edit" size={18} color="#FFF" />
            <Text style={styles.menuText}>Modifier profil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="settings" size={18} color="#FFF" />
            <Text style={styles.menuText}>Paramètres</Text>
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="log-out" size={18} color="#FF4444" />
            <Text style={[styles.menuText, { color: '#FF4444' }]}>Déconnexion</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <FlatList
        data={filteredData}
        renderItem={renderCryptoItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Orbitron_700Bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    height: '100%',
    padding: 0,
  },
  cryptoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 24,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cryptoIcon: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  nameContainer: {
    justifyContent: 'center',
  },
  cryptoName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cryptoSymbol: {
    color: '#666',
    fontSize: 14,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  change: {
    fontSize: 14,
  },
  profileMenu: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  menuText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 4,
  },
});
