import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Skill } from '../types';
import { ProgressBar } from './ProgressBar';
import { CategoryBadge } from './CategoryBadge';

interface SkillCardProps {
  skill: Skill;
  onPress: (skill: Skill) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, onPress }) => {
  const handlePress = () => {
    onPress(skill);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {skill.name}
        </Text>
        <CategoryBadge category={skill.category} />
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {skill.description}
      </Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Progresso: {skill.currentProgress}%
          </Text>
          {skill.targetProgress && (
            <Text style={styles.targetText}>
              Meta: {skill.targetProgress}%
            </Text>
          )}
        </View>
        <ProgressBar progress={skill.currentProgress} />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.date}>
          Criado em: {skill.createdAt.toLocaleDateString('pt-BR')}
        </Text>
        {skill.isCompleted && (
          <Text style={styles.completed}>✅ Concluída</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  targetText: {
    fontSize: 12,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  completed: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: 'bold',
  },
});