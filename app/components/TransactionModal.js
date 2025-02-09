import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import TransactionHistory from './TransactionHistory';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TransactionModal({ visible, onClose, navigation }) {
  const [amount, setAmount] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [step, setStep] = useState(1);
  const [transactions, setTransactions] = useState([]);

  // Charger les transactions au démarrage
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions).map(t => ({
          ...t,
          date: new Date(t.date)
        }));
        setTransactions(parsedTransactions);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
    }
  };

  const saveTransactions = async (newTransactions) => {
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(newTransactions));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des transactions:', error);
    }
  };

  const handleTransaction = () => {
    const newTransaction = {
      id: Date.now(),
      date: new Date(),
      type: selectedType,
      amount: parseFloat(amount),
      status: 'En attente'
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    setAmount('');
    setStep(1);
  };

  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleBack = () => {
    setSelectedType(null);
    setStep(1);
  };

  const handleAmountChange = (text) => {
    setAmount(text);
  };

  const handleSubmit = () => {
    handleTransaction();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}
        >
          <TouchableOpacity 
            activeOpacity={1}
            style={[
              styles.modalContent,
              step === 2 && { maxHeight: Platform.OS === 'ios' ? '50%' : '60%' }
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  Keyboard.dismiss();
                  step === 1 ? onClose() : setStep(1);
                }}
              >
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {step === 1 ? 'Transactions' : selectedType === 'deposit' ? 'Dépôt' : 'Retrait'}
              </Text>
            </View>

            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollViewContent,
                step === 2 && { justifyContent: 'center' }
              ]}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {step === 1 ? (
                <View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={styles.transactionButton}
                      onPress={() => handleTypeSelect('deposit')}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: 'rgba(46, 204, 113, 0.1)' }]}>
                        <Feather name="arrow-down-circle" size={24} color="#2ECC71" />
                      </View>
                      <Text style={styles.buttonText}>Dépôt</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.transactionButton}
                      onPress={() => handleTypeSelect('withdrawal')}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 68, 68, 0.1)' }]}>
                        <Feather name="arrow-up-circle" size={24} color="#FF4444" />
                      </View>
                      <Text style={styles.buttonText}>Retrait</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <TransactionHistory transactions={transactions} formatDate={formatDate} />
                </View>
              ) : (
                <View style={styles.formContainer}>
                  <Text style={styles.label}>Montant</Text>
                  <View style={styles.amountInputContainer}>
                    <TextInput
                      style={styles.amountInput}
                      value={amount}
                      onChangeText={handleAmountChange}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#666"
                      autoFocus={true}
                      selectTextOnFocus={true}
                    />
                    <Text style={styles.currency}>€</Text>
                  </View>

                  <TouchableOpacity 
                    style={[
                      styles.submitButton,
                      {
                        backgroundColor: !amount || parseFloat(amount) <= 0 
                          ? '#1A1A1A' 
                          : selectedType === 'deposit' 
                            ? '#27AE60' 
                            : '#E74C3C',
                        opacity: amount && parseFloat(amount) > 0 ? 1 : 0.5,
                      }
                    ]}
                    onPress={handleSubmit}
                    disabled={!amount || parseFloat(amount) <= 0}
                  >
                    <Text style={styles.submitButtonText}>
                      {selectedType === 'deposit' ? 'Déposer' : 'Retirer'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2A2A2A',
    width: '100%',
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    zIndex: 1,
    top: Platform.OS === 'ios' ? 40 : 20,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  transactionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  label: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  amountInputContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  amountInput: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 120,
    padding: 8,
  },
  currency: {
    color: '#888',
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#27AE60',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
