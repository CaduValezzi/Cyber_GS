import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { useSkill } from '../context/SkillContext';
import { SkillCard } from '../components/SkillCard';
import { Skill, HomeScreenNavigationProp } from '../types';

// Atualizar a interface das props
interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { skills } = useSkill();

  const handleSkillPress = (skill: Skill) => {
    navigation.navigate('SkillDetails', { skillId: skill.id });
  };

  const handleAddSkill = () => {
    navigation.navigate('AddEditSkill');
  };
  
  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('✅ Sucesso', 'AsyncStorage limpo completamente!');
      // Recarrega o app
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('❌ Erro', 'Não foi possível limpar os dados');
    }
  };

  // Calcular estatísticas rápidas
  const totalSkills = skills.length;
  const completedSkills = skills.filter(skill => skill.isCompleted).length;
  const averageProgress = skills.length > 0 
    ? Math.round(skills.reduce((sum, skill) => sum + skill.currentProgress, 0) / skills.length)
    : 0;

  return (
    <View style={styles.container}>
      {/* Header com estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalSkills}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{completedSkills}</Text>
          <Text style={styles.statLabel}>Concluídas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{averageProgress}%</Text>
          <Text style={styles.statLabel}>Progresso Médio</Text>
        </View>
      </View>

      <FlatList
        data={skills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SkillCard skill={item} onPress={handleSkillPress} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma competência cadastrada. 
            </Text>
            <Text style={styles.emptySubtext}>
              Toque no botão "+" para adicionar uma nova!
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity style={styles.fab} onPress={handleAddSkill}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2196f3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
