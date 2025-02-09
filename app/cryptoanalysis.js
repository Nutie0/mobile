import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnalysisResults from './components/AnalysisResults';
import { 
  useFonts,
  Orbitron_700Bold,
} from '@expo-google-fonts/orbitron';

export default function CryptoAnalysisScreen() {
  const [selectedType, setSelectedType] = useState('');
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [startDate, setStartDate] = useState('01/09/2025 05:31 AM');
  const [endDate, setEndDate] = useState('02/09/2025 05:31 AM');
  const [showTypeSelect, setShowTypeSelect] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const analysisTypes = [
    { id: 'first_quartile', name: 'First quartile' },
    { id: 'maximum', name: 'Maximum' },
    { id: 'minimum', name: 'Minimum' },
    { id: 'average', name: 'Average' },
    { id: 'standard_deviation', name: 'Standard deviation' },
  ];

  const cryptoOptions = [
    { id: 'all', name: 'All' },
    { id: 'btc', name: 'Bitcoin' },
    { id: 'eth', name: 'Ethereum' },
    { id: 'bnb', name: 'Binance' },
    { id: 'ripple', name: 'Ripple' },
    { id: 'others', name: 'Others' },
    { id: 'test1', name: 'Test1' },
  ];

  const handleStartAnalysis = () => {
    // Simuler des résultats d'analyse
    const mockResults = [
      {
        id: 'btc',
        name: 'Bitcoin',
        value: 0.18,
        percentage: -0.17,
        referenceDate: '02/08/2025 10:27',
        calculatedOn: 573,
      },
      {
        id: 'eth',
        name: 'Ethereum',
        value: 3.90,
        percentage: -1.80,
        referenceDate: '02/08/2025 10:21',
        calculatedOn: 573,
      },
      {
        id: 'bnb',
        name: 'Ripple',
        value: 0.10,
        percentage: 1.03,
        referenceDate: '02/08/2025 10:24',
        calculatedOn: 573,
      },
      {
        id: 'ltc',
        name: 'Litecoin',
        value: 0.10,
        percentage: 3.40,
        referenceDate: '02/08/2025 10:20',
        calculatedOn: 573,
      },
      {
        id: 'ada',
        name: 'Cardano',
        value: 0.65,
        percentage: -4.63,
        referenceDate: '02/08/2025 10:21',
        calculatedOn: 573,
      },
      {
        id: 'test1',
        name: 'Test1',
        value: 8.90,
        percentage: -0.44,
        referenceDate: '02/08/2025 10:53',
        calculatedOn: 573,
      },
    ];

    setAnalysisResults({
      type: analysisTypes.find(t => t.id === selectedType)?.name || '',
      startDate: '02/07/2025 10:16',
      endDate: '02/08/2025 10:45',
      results: mockResults,
    });
    setShowResults(true);
  };

  const TypeSelectModal = ({ visible, onClose }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Analysis Type</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          {analysisTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.modalOption,
                selectedType === type.id && styles.modalOptionSelected
              ]}
              onPress={() => {
                setSelectedType(type.id);
                onClose();
              }}
            >
              <Text style={[
                styles.modalOptionText,
                selectedType === type.id && styles.modalOptionTextSelected
              ]}>
                {type.name}
              </Text>
              {selectedType === type.id && (
                <Feather name="check" size={20} color="#2ECC71" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  if (showResults && analysisResults) {
    return (
      <AnalysisResults
        analysisType={analysisResults.type}
        startDate={analysisResults.startDate}
        endDate={analysisResults.endDate}
        results={analysisResults.results}
        onNewAnalysis={() => setShowResults(false)}
        onBack={() => setShowResults(false)}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="bar-chart-2" size={24} color="#2ECC71" />
          <View>
            <Text style={styles.headerTitle}>Filtres d'analyse</Text>
            <Text style={styles.headerSubtitle}>Configurez vos paramètres</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Type d'analyse</Text>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => setShowTypeSelect(true)}
          >
            <Text style={[
              styles.selectButtonText,
              selectedType && styles.selectButtonTextActive
            ]}>
              {selectedType ? analysisTypes.find(t => t.id === selectedType)?.name : 'Select an analysis type'}
            </Text>
            <Feather name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Sélection des cryptomonnaies</Text>
          <View style={styles.cryptoGrid}>
            {cryptoOptions.map((crypto) => (
              <View key={crypto.id} style={styles.cryptoItem}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => {
                    if (selectedCryptos.includes(crypto.id)) {
                      setSelectedCryptos(selectedCryptos.filter(id => id !== crypto.id));
                    } else {
                      setSelectedCryptos([...selectedCryptos, crypto.id]);
                    }
                  }}
                >
                  <View style={[
                    styles.checkboxInner,
                    selectedCryptos.includes(crypto.id) && styles.checkboxChecked
                  ]}>
                    {selectedCryptos.includes(crypto.id) && (
                      <Feather name="check" size={14} color="#FFF" />
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={styles.cryptoName}>{crypto.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.dateColumn}>
            <Text style={styles.label}>Date début</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateText}>{startDate}</Text>
              <Feather name="calendar" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.dateColumn}>
            <Text style={styles.label}>Date fin</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateText}>{endDate}</Text>
              <Feather name="calendar" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.analyzeButton}
          onPress={handleStartAnalysis}
        >
          <Text style={styles.analyzeButtonText}>Analyser</Text>
        </TouchableOpacity>
      </View>
      <TypeSelectModal
        visible={showTypeSelect}
        onClose={() => setShowTypeSelect(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: '#1A1A1A',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 24,
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#2ECC71',
    fontSize: 12,
    letterSpacing: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 12,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    height: 48,
  },
  selectButtonText: {
    color: '#666',
    fontSize: 14,
  },
  selectButtonTextActive: {
    color: '#FFF',
  },
  cryptoGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  cryptoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2ECC71',
    borderColor: '#2ECC71',
  },
  cryptoName: {
    color: '#FFF',
    fontSize: 14,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  dateColumn: {
    flex: 1,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    height: 48,
  },
  dateText: {
    color: '#FFF',
    fontSize: 14,
  },
  analyzeButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
  },
  modalOptionSelected: {
    backgroundColor: '#1A1A1A',
  },
  modalOptionText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalOptionTextSelected: {
    color: '#2ECC71',
    fontWeight: 'bold',
  },
});
