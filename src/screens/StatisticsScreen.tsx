import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatisticsScreenProps {
  navigation: any;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ 
  navigation 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estatísticas</Text>
      <Text>Gráficos virão aqui...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});