import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function CommissionScreen() {
  const [buyCommission, setBuyCommission] = useState('2.50');
  const [sellCommission, setSellCommission] = useState('1.50');

  const handleSaveCommissions = () => {
    // TODO: Implement saving to storage
    console.log('Commissions saved:', { buyCommission, sellCommission });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.scrollView}>
          <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Commissions</Text>
              <TouchableOpacity style={styles.headerButton}>
                <Feather name="percent" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Paramètres des commissions</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Commission d'achat (%)</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={buyCommission}
                      onChangeText={setBuyCommission}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#666"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <Feather name="trending-up" size={20} color="#2ECC71" />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Commission de vente (%)</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={sellCommission}
                      onChangeText={setSellCommission}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#666"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <Feather name="trending-down" size={20} color="#FF4444" />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveCommissions}
                >
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                  <Feather name="check" size={20} color="#FFF" style={styles.saveButtonIcon} />
                </TouchableOpacity>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Information</Text>
                <Text style={styles.infoText}>
                  Les commissions sont appliquées à chaque transaction d'achat ou de vente
                  de cryptomonnaies. Ces frais sont calculés en pourcentage du montant total
                  de la transaction.
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#CCC',
    fontSize: 16,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#2ECC71',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  saveButtonIcon: {
    marginLeft: 5,
  },
  infoSection: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  infoText: {
    color: '#CCC',
    fontSize: 14,
    lineHeight: 20,
  },
});
