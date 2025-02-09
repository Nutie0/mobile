import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CandlestickChart } from 'react-native-wagmi-charts';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const TIME_PERIODS = ['1H', '1D', '1W', '1M', '1Y'];

const generateCandleData = (basePrice, count = 30) => {
  const data = [];
  let lastClose = basePrice;
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - (count - i) * 3600000).getTime();
    const percentChange = (Math.random() - 0.5) * 0.02;
    const open = lastClose;
    const close = open * (1 + percentChange);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    
    lastClose = close;
    
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
    });
  }
  
  return data;
};

export default function CryptoDetailScreen() {
  const params = useLocalSearchParams();
  const id = params?.id || 'btc'; // Valeur par défaut si id n'est pas défini
  const [currentPrice, setCurrentPrice] = useState(42563.25);
  const [candleData, setCandleData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('1H');
  const [priceChange, setPriceChange] = useState('+1.37');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setCandleData(generateCandleData(currentPrice));
  }, [currentPrice]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{currentPrice.toLocaleString('fr-FR')} €</Text>
          <Text style={[styles.change, { color: priceChange.startsWith('+') ? '#27AE60' : '#E74C3C' }]}>
            {priceChange}% today
          </Text>
        </View>
      </View>

      <View style={styles.timeframeContainer}>
        {TIME_PERIODS.map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.timeframeButton,
              selectedPeriod === period && styles.selectedTimeframe,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.timeframeText,
              selectedPeriod === period && styles.selectedTimeframeText
            ]}>
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chartContainer}>
        <CandlestickChart.Provider data={candleData}>
          <CandlestickChart height={300}>
            <CandlestickChart.Candles />
            <CandlestickChart.Crosshair>
              <CandlestickChart.Tooltip />
            </CandlestickChart.Crosshair>
          </CandlestickChart>
        </CandlestickChart.Provider>
      </View>

      <TouchableOpacity 
        style={styles.buyButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.buyButtonText}>Buy {id.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Feather name="x" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Buy {id.toUpperCase()}</Text>
            <Text style={styles.modalPrice}>Current Price: {currentPrice.toLocaleString('fr-FR')} €</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  priceContainer: {
    marginTop: 20,
  },
  price: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  change: {
    fontSize: 16,
    marginTop: 4,
  },
  timeframeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  timeframeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#2A2A2A',
  },
  selectedTimeframe: {
    backgroundColor: '#27AE60',
  },
  timeframeText: {
    color: '#888',
    fontSize: 14,
  },
  selectedTimeframeText: {
    color: '#FFF',
    fontWeight: '600',
  },
  chartContainer: {
    paddingHorizontal: 0,
    height: 350,
    backgroundColor: '#1A1A1A',
  },
  buyButton: {
    backgroundColor: '#27AE60',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
  },
  modalPrice: {
    color: '#888',
    fontSize: 16,
  },
});
