import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Mock data for current positions
const currentPositions = [
  {
    id: 'sxd1',
    symbol: 'BTC',
    purchaseDate: '05/02/2023',
    purchasePrice: '42563.25',
    quantity: '0.5',
    currentValue: '44521.80',
    change: '+4.52%',
  },
  {
    id: 'sxd2',
    symbol: 'ETH',
    purchaseDate: '05/02/2023',
    purchasePrice: '1842.33',
    quantity: '2.5',
    currentValue: '1821.40',
    change: '-1.17%',
  },
];

// Mock data for transaction history
const transactionHistory = [
  {
    date: '05/02/2023 20:43',
    crypto: 'BTC',
    type: 'purchase',
    quantity: '0.5',
    unitPrice: '42563.25',
    total: '21281.63',
  },
  {
    date: '05/02/2023 19:18',
    crypto: 'ETH',
    type: 'sale',
    quantity: '1.5',
    unitPrice: '1842.33',
    total: '2763.50',
  },
  {
    date: '05/02/2023 17:42',
    crypto: 'BTC',
    type: 'purchase',
    quantity: '0.2',
    unitPrice: '42563.25',
    total: '8512.65',
  },
];

export default function PortfolioScreen() {
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [sellAmount, setSellAmount] = useState('');

  const handleSell = (position) => {
    setSelectedCrypto(position);
    setSellAmount('');
    setSellModalVisible(true);
  };

  const handleConfirmSell = () => {
    // TODO: Implement sell logic
    console.log(`Selling ${sellAmount} ${selectedCrypto.symbol}`);
    setSellModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with Wallet Balance */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wallet Balance</Text>
          <Text style={styles.balance}>2,563.52 €</Text>
        </View>

        {/* Current Positions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Positions</Text>
          {currentPositions.map((position) => (
            <View key={position.id} style={styles.positionCard}>
              <View style={styles.positionHeader}>
                <Text style={styles.cryptoSymbol}>{position.symbol}</Text>
                <Text style={styles.positionDate}>Purchase on {position.purchaseDate}</Text>
              </View>
              <View style={styles.positionDetails}>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Purchase price</Text>
                  <Text style={styles.detailValue}>
                    {parseFloat(position.purchasePrice).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €
                  </Text>
                </View>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Quantity</Text>
                  <Text style={styles.detailValue}>
                    {parseFloat(position.quantity).toLocaleString('fr-FR', { maximumFractionDigits: 4 })}
                  </Text>
                </View>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Current Value</Text>
                  <Text style={styles.detailValue}>
                    {parseFloat(position.currentValue).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €
                  </Text>
                </View>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Total</Text>
                  <Text style={styles.detailValue}>
                    {(parseFloat(position.currentValue) * parseFloat(position.quantity)).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.sellButton}
                  onPress={() => handleSell(position)}
                >
                  <Text style={styles.sellButtonText}>Sell</Text>
                </TouchableOpacity>
              </View>
              <Text style={[
                styles.changeText,
                { color: position.change.startsWith('+') ? '#4CAF50' : '#FF4444' }
              ]}>
                {position.change}
              </Text>
            </View>
          ))}
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <View style={styles.transactionHeader}>
            <Text style={styles.columnHeader}>Date</Text>
            <Text style={styles.columnHeader}>Crypto</Text>
            <Text style={styles.columnHeader}>Type</Text>
            <Text style={styles.columnHeader}>Quantity</Text>
            <Text style={styles.columnHeader}>Unit price</Text>
            <Text style={styles.columnHeader}>Total</Text>
          </View>
          {transactionHistory.map((transaction, index) => (
            <View key={index} style={styles.transactionRow}>
              <Text style={styles.transactionText}>{transaction.date}</Text>
              <Text style={styles.transactionText}>{transaction.crypto}</Text>
              <Text style={[
                styles.transactionText,
                { color: transaction.type === 'purchase' ? '#4CAF50' : '#FF4444' }
              ]}>
                {transaction.type}
              </Text>
              <Text style={styles.transactionText}>{transaction.quantity}</Text>
              <Text style={styles.transactionText}>{transaction.unitPrice} €</Text>
              <Text style={styles.transactionText}>{transaction.total} €</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sell Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={sellModalVisible}
        onRequestClose={() => setSellModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSellModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Sell {selectedCrypto?.symbol}
                </Text>
                <View style={styles.modalBody}>
                  <Text style={styles.modalLabel}>
                    Available: {selectedCrypto?.quantity} {selectedCrypto?.symbol}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Amount to sell"
                    placeholderTextColor="#666"
                    keyboardType="decimal-pad"
                    value={sellAmount}
                    onChangeText={setSellAmount}
                  />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setSellModalVisible(false)}
                    >
                      <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={handleConfirmSell}
                    >
                      <Text style={styles.modalButtonText}>Confirm Sale</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#666',
    fontSize: 16,
  },
  balance: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  positionCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cryptoSymbol: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  positionDate: {
    color: '#666',
    fontSize: 14,
  },
  positionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: '#FFF',
    fontSize: 14,
  },
  sellButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sellButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  changeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  columnHeader: {
    color: '#666',
    fontSize: 12,
    flex: 1,
    textAlign: 'left',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  transactionText: {
    color: '#FFF',
    fontSize: 12,
    flex: 1,
    textAlign: 'left',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalBody: {
    alignItems: 'stretch',
  },
  modalLabel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  confirmButton: {
    backgroundColor: '#FF4444',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
