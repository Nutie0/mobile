import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AnalysisResults({ 
  analysisType,
  startDate,
  endDate,
  results,
  onNewAnalysis,
}) {
  const formatPercentage = (value) => {
    const isPositive = value > 0;
    return `${isPositive ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Résultats d'analyse</Text>
        <View style={styles.analysisInfo}>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Analysis Type:</Text>
            <Text style={styles.infoValue}>{analysisType}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Start date and time:</Text>
            <Text style={styles.infoValue}>{startDate}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>End date and time:</Text>
            <Text style={styles.infoValue}>{endDate}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.resultsGrid}>
          {results.map((crypto) => (
            <View key={crypto.id} style={styles.cryptoCard}>
              <Text style={styles.cryptoName}>{crypto.name}</Text>
              <View style={styles.cryptoDetails}>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{crypto.value} €</Text>
                  <Text style={[
                    styles.percentage,
                    { color: crypto.percentage > 0 ? '#2ECC71' : '#E74C3C' }
                  ]}>
                    {formatPercentage(crypto.percentage)}
                  </Text>
                </View>
                <Text style={styles.referenceDate}>
                  Reference date: {crypto.referenceDate}
                </Text>
                <Text style={styles.calculatedText}>
                  Calculated on {crypto.calculatedOn} variables
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.newAnalysisButton}
          onPress={onNewAnalysis}
        >
          <Text style={styles.newAnalysisButtonText}>New analysis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 16,
  },
  analysisInfo: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    color: '#999',
    fontSize: 14,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  resultsGrid: {
    padding: 16,
  },
  cryptoCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cryptoName: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 8,
  },
  cryptoDetails: {
    gap: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 14,
  },
  referenceDate: {
    color: '#999',
    fontSize: 12,
  },
  calculatedText: {
    color: '#999',
    fontSize: 12,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#1A1A1A',
  },
  newAnalysisButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  newAnalysisButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
