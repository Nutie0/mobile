import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFonts, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { LineChart, BarChart } from 'react-native-chart-kit';

const CRYPTOCURRENCIES = [
  { id: 'all', name: 'Toutes les cryptos' },
  { id: 'btc', name: 'Bitcoin' },
  { id: 'eth', name: 'Ethereum' },
  { id: 'bnb', name: 'Binance Coin' },
  { id: 'sol', name: 'Solana' },
  { id: 'ada', name: 'Cardano' },
];

const ANALYSIS_TYPES = [
  { id: 'sum', name: 'Somme' },
  { id: 'average', name: 'Moyenne' },
];

export default function AnalysisScreen() {
  const [selectedType, setSelectedType] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTOCURRENCIES[0]);
  const [startDate, setStartDate] = useState('01/09/2025 05:31 AM');
  const [endDate, setEndDate] = useState('02/09/2025 05:31 AM');
  const [showTypeSelect, setShowTypeSelect] = useState(false);
  const [showCryptoSelect, setShowCryptoSelect] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState({
    totalCommissions: "1 188,84 €",
    totalTransactions: "121",
    timelineData: {
      labels: ["07/02/2025", "08/02/2025", "09/02/2025"],
      buyCommissions: [100, 700, 150],
      sellCommissions: [50, 200, 100]
    },
    distributionData: {
      labels: ["0-10€", "10-50€", "50-100€", "100-500€", "500+€"],
      data: [72, 25, 5, 2, 17]
    },
    detailsData: [
      { crypto: "test1", commissions: "597,40 €", transactions: "68" },
      { crypto: "Cardano", commissions: "403,33 €", transactions: "18" },
      { crypto: "Bitcoin", commissions: "77,60 €", transactions: "16" },
      { crypto: "Ethereum", commissions: "62,70 €", transactions: "5" },
      { crypto: "Litecoin", commissions: "47,81 €", transactions: "14" }
    ]
  });

  const [showBuyCommission, setShowBuyCommission] = useState(true);
  const [showSellCommission, setShowSellCommission] = useState(true);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = analysisData.detailsData
    .filter(item => 
      item.crypto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.commissions.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transactions.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'commissions') {
        aValue = parseFloat(aValue.replace('€', '').trim());
        bValue = parseFloat(bValue.replace('€', '').trim());
      } else if (sortConfig.key === 'transactions') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const chartConfig = {
    backgroundGradientFrom: '#2A2A2A',
    backgroundGradientTo: '#2A2A2A',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: '#333',
      strokeDasharray: '0',
    },
    propsForLabels: {
      fontSize: 10,
    }
  };

  const getTimelineData = () => {
    const datasets = [];
    if (showBuyCommission) {
      datasets.push({
        data: [100, 700, 150],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2
      });
    }
    if (showSellCommission) {
      datasets.push({
        data: [50, 200, 100],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2
      });
    }
    return {
      labels: ['07/02/2025', '08/02/2025', '09/02/2025'],
      datasets,
      legend: ['Commission achat', 'Commission vente'].slice(0, datasets.length)
    };
  };

  const getDistributionData = () => ({
    labels: analysisData.distributionData.labels,
    datasets: [{
      data: analysisData.distributionData.data,
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`
    }]
  });

  const handleAnalysis = () => {
    setShowResults(true);
  };

  if (showResults) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowResults(false)}
          >
            <Feather name="arrow-left" size={24} color="#FFF" />
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total des commissions</Text>
            <Text style={styles.statValue}>{analysisData.totalCommissions}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Nombre de transactions</Text>
            <Text style={styles.statValue}>{analysisData.totalTransactions}</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Évolution temporelle</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                showBuyCommission && styles.filterButtonActive
              ]}
              onPress={() => setShowBuyCommission(!showBuyCommission)}
            >
              <View style={[styles.filterColor, { backgroundColor: '#007AFF' }]} />
              <Text style={[
                styles.filterText,
                showBuyCommission && styles.filterTextActive
              ]}>Commission achat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                showSellCommission && styles.filterButtonActive
              ]}
              onPress={() => setShowSellCommission(!showSellCommission)}
            >
              <View style={[styles.filterColor, { backgroundColor: '#2ECC71' }]} />
              <Text style={[
                styles.filterText,
                showSellCommission && styles.filterTextActive
              ]}>Commission vente</Text>
            </TouchableOpacity>
          </View>

          {(showBuyCommission || showSellCommission) ? (
            <LineChart
              data={getTimelineData()}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={true}
              withVerticalLines={true}
              withHorizontalLines={true}
              yAxisLabel=""
              yAxisSuffix="€"
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Sélectionnez au moins une courbe à afficher</Text>
            </View>
          )}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Distribution des commissions</Text>
          <BarChart
            data={getDistributionData()}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisLabel=""
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            }}
            style={styles.chart}
            showValuesOnTopOfBars={true}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail par crypto</Text>
          
          <View style={styles.tableControls}>
            <View style={styles.rowsPerPageContainer}>
              <Text style={styles.controlLabel}>Afficher</Text>
              <TouchableOpacity 
                style={styles.rowsSelect}
                onPress={() => {
                  // Vous pouvez ajouter un modal ici pour la sélection
                  const options = [5, 10, 25, 50];
                  setRowsPerPage(options[(options.indexOf(rowsPerPage) + 1) % options.length]);
                }}
              >
                <Text style={styles.rowsSelectText}>{rowsPerPage}</Text>
                <Feather name="chevron-down" size={16} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.controlLabel}>entrées</Text>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.controlLabel}>Rechercher :</Text>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Rechercher..."
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <TouchableOpacity 
                style={[styles.headerCell, { flex: 2 }]}
                onPress={() => handleSort('crypto')}
              >
                <Text style={styles.headerCellText}>Crypto</Text>
                {sortConfig.key === 'crypto' && (
                  <Feather 
                    name={sortConfig.direction === 'asc' ? 'chevron-up' : 'chevron-down'} 
                    size={16} 
                    color="#FFF" 
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.headerCell, { flex: 3 }]}
                onPress={() => handleSort('commissions')}
              >
                <Text style={styles.headerCellText}>Total commissions</Text>
                {sortConfig.key === 'commissions' && (
                  <Feather 
                    name={sortConfig.direction === 'asc' ? 'chevron-up' : 'chevron-down'} 
                    size={16} 
                    color="#FFF" 
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.headerCell, { flex: 2 }]}
                onPress={() => handleSort('transactions')}
              >
                <Text style={styles.headerCellText}>Transactions</Text>
                {sortConfig.key === 'transactions' && (
                  <Feather 
                    name={sortConfig.direction === 'asc' ? 'chevron-up' : 'chevron-down'} 
                    size={16} 
                    color="#FFF" 
                  />
                )}
              </TouchableOpacity>
            </View>

            {paginatedData.map((item, index) => (
              <View 
                key={item.crypto} 
                style={[
                  styles.tableRow,
                  index % 2 === 0 && styles.tableRowEven
                ]}
              >
                <Text style={[styles.cell, { flex: 2 }]}>{item.crypto}</Text>
                <Text style={[styles.cell, { flex: 3 }]}>{item.commissions}</Text>
                <Text style={[styles.cell, { flex: 2 }]}>{item.transactions}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tablePagination}>
            <Text style={styles.paginationInfo}>
              Affichage de {(currentPage - 1) * rowsPerPage + 1} à {Math.min(currentPage * rowsPerPage, filteredData.length)} sur {filteredData.length} entrées
            </Text>
            <View style={styles.paginationControls}>
              <TouchableOpacity 
                style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <Text style={styles.paginationButtonText}>Précédente</Text>
              </TouchableOpacity>
              <View style={styles.paginationCurrent}>
                <Text style={styles.paginationCurrentText}>{currentPage}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.paginationButtonText}>Suivante</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.label}>Cryptomonnaie</Text>
            <TouchableOpacity 
              style={styles.select}
              onPress={() => setShowCryptoSelect(true)}
            >
              <Text style={styles.selectText}>{selectedCrypto.name}</Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Type d'analyse</Text>
            <TouchableOpacity 
              style={styles.select}
              onPress={() => setShowTypeSelect(true)}
            >
              <Text style={[
                styles.selectText,
                selectedType && styles.selectTextActive
              ]}>
                {selectedType || 'Select an analysis type'}
              </Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.dateSection}>
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
            onPress={handleAnalysis}
          >
            <Text style={styles.analyzeButtonText}>Analyser</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showTypeSelect}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTypeSelect(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un type</Text>
              <TouchableOpacity onPress={() => setShowTypeSelect(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            {ANALYSIS_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.modalOption,
                  selectedType === type.id && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedType(type.id);
                  setShowTypeSelect(false);
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

      <Modal
        visible={showCryptoSelect}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCryptoSelect(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner une crypto</Text>
              <TouchableOpacity onPress={() => setShowCryptoSelect(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            {CRYPTOCURRENCIES.map((crypto) => (
              <TouchableOpacity
                key={crypto.id}
                style={[
                  styles.modalOption,
                  selectedCrypto.id === crypto.id && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedCrypto(crypto);
                  setShowCryptoSelect(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedCrypto.id === crypto.id && styles.modalOptionTextSelected
                ]}>
                  {crypto.name}
                </Text>
                {selectedCrypto.id === crypto.id && (
                  <Feather name="check" size={20} color="#2ECC71" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    padding: 20,
    backgroundColor: '#2A2A2A',
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Orbitron_700Bold',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 20,
  },
  section: {
    margin: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  label: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    height: 48,
  },
  selectText: {
    color: '#666',
    fontSize: 14,
  },
  selectTextActive: {
    color: '#FFF',
  },
  dateSection: {
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
    backgroundColor: '#1A1A1A',
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
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  chartCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  chartTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  headerCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  headerCellText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tableRowEven: {
    backgroundColor: '#333',
  },
  cell: {
    color: '#FFF',
    fontSize: 14,
    paddingHorizontal: 8,
  },
  tableControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  rowsPerPageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlLabel: {
    color: '#666',
    fontSize: 14,
  },
  rowsSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    gap: 8,
    minWidth: 60,
    justifyContent: 'space-between',
  },
  rowsSelectText: {
    color: '#FFF',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    backgroundColor: '#1A1A1A',
    color: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    width: 200,
    borderWidth: 1,
    borderColor: '#444',
  },
  tablePagination: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  paginationInfo: {
    color: '#666',
    fontSize: 14,
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paginationButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#444',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  paginationCurrent: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  paginationCurrentText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2A2A2A',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterButtonActive: {
    borderColor: '#FFF',
  },
  filterColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  filterText: {
    color: '#666',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#FFF',
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginVertical: 8,
  },
  noDataText: {
    color: '#666',
    fontSize: 14,
  },
});
