import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const TransactionHistory = ({ transactions, formatDate }) => {
  const getStatusColor = (status) => {
    return status === 'Approuvé' ? '#27AE60' : '#F1C40F';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des transactions</Text>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, styles.dateColumn]}>DATE</Text>
        <Text style={[styles.headerText, styles.typeColumn]}>TYPE</Text>
        <Text style={[styles.headerText, styles.amountColumn]}>MONTANT</Text>
        <Text style={[styles.headerText, styles.statusColumn]}>STATUS</Text>
      </View>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
      >
        {transactions.map((transaction, index) => (
          <View
            key={transaction.id}
            style={[
              styles.row,
              index % 2 === 0 ? styles.evenRow : styles.oddRow,
            ]}
          >
            <Text style={[styles.text, styles.dateColumn]}>
              {formatDate(transaction.date)}
            </Text>
            <View style={[styles.typeColumn, styles.typeContainer]}>
              <Feather
                name={transaction.type === 'deposit' ? 'arrow-down' : 'arrow-up'}
                size={14}
                color={transaction.type === 'deposit' ? '#27AE60' : '#E74C3C'}
              />
              <Text
                style={[
                  styles.text,
                  {
                    color: transaction.type === 'deposit' ? '#27AE60' : '#E74C3C',
                  },
                ]}
              >
                {transaction.type === 'deposit' ? 'Dépôt' : 'Retrait'}
              </Text>
            </View>
            <Text
              style={[
                styles.text,
                styles.amountColumn,
                {
                  color: transaction.type === 'deposit' ? '#27AE60' : '#E74C3C',
                },
              ]}
            >
              {transaction.type === 'deposit' ? '+' : '-'}
              {transaction.amount}€
            </Text>
            <View style={[styles.statusColumn, styles.statusContainer]}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusColor(transaction.status),
                  },
                ]}
              />
              <Text style={[styles.text, { color: getStatusColor(transaction.status) }]}>
                {transaction.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    marginHorizontal: 0,
    marginTop: 15,
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  scrollView: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  evenRow: {
    backgroundColor: '#1A1A1A',
  },
  oddRow: {
    backgroundColor: '#222',
  },
  text: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '400',
  },
  dateColumn: {
    flex: 2.5,
    paddingRight: 12,
  },
  typeColumn: {
    flex: 2,
    paddingHorizontal: 8,
  },
  amountColumn: {
    flex: 2,
    textAlign: 'right',
    paddingHorizontal: 8,
  },
  statusColumn: {
    flex: 1.8,
    paddingLeft: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default TransactionHistory;
