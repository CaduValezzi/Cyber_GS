import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput 
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useSkill } from '../context/SkillContext';
import { ProgressBar } from '../components/ProgressBar';
import { CategoryBadge } from '../components/CategoryBadge';
import { SkillDetailsScreenNavigationProp, RootStackParamList } from '../types'; 

type SkillDetailsScreenRouteProp = RouteProp<RootStackParamList, 'SkillDetails'>;

interface SkillDetailsScreenProps {
  navigation: SkillDetailsScreenNavigationProp;
  route: SkillDetailsScreenRouteProp;
}

export const SkillDetailsScreen: React.FC<SkillDetailsScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { skillId } = route.params;
  const { skills, updateSkill, deleteSkill, addProgressUpdate, getProgressUpdatesForSkill, reloadData } = useSkill(); // 👈 ADICIONAR reloadData
  
  const skill = skills.find(s => s.id === skillId);
  const progressHistory = getProgressUpdatesForSkill(skillId);
  
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [newProgress, setNewProgress] = useState(skill?.currentProgress.toString() || '0');
  const [progressNotes, setProgressNotes] = useState('');

  if (!skill) {
    return (
      <View style={styles.container}>
        <Text>Competência não encontrada.</Text>
      </View>
    );
  }

  const handleUpdateProgress = () => {
    const progressValue = parseInt(newProgress);
    
    if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
      Alert.alert('Erro', 'Por favor, digite um valor entre 0 e 100');
      return;
    }

    // Atualizar progresso da skill
    updateSkill(skillId, { 
      currentProgress: progressValue,
      isCompleted: progressValue === 100 
    });

    // Adicionar ao histórico
    if (progressValue !== skill.currentProgress) {
      addProgressUpdate({
        skillId,
        progress: progressValue,
        notes: progressNotes.trim() || undefined
      });
    }

    setProgressModalVisible(false);
    setProgressNotes('');
  };
  
  // Função de exclusão
  const handleDeleteSkill = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir "${skill.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Excluindo skill:', skill.id, skill.name);
              await deleteSkill(skillId);
              console.log('✅ Skill excluída com sucesso');
              
              // Recarregar dados para garantir sincronização
              await reloadData();
              
              // Navegar de volta para Home
              navigation.navigate('Home');
            } catch (error) {
              console.error('❌ Erro ao excluir skill:', error);
              Alert.alert('Erro', 'Não foi possível excluir a competência.');
            }
          }
        }
      ]
    );
  };

  const handleEditSkill = () => {
    navigation.navigate('AddEditSkill', { skillId });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{skill.name}</Text>
          <CategoryBadge category={skill.category} />
        </View>
        <Text style={styles.description}>{skill.description}</Text>
      </View>

      {/* Progresso */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progresso</Text>
        <ProgressBar progress={skill.currentProgress} height={20} />
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {skill.currentProgress}% concluído
          </Text>
          {skill.targetProgress && (
            <Text style={styles.targetText}>
              Meta: {skill.targetProgress}%
            </Text>
          )}
        </View>
        {skill.isCompleted && (
          <Text style={styles.completedText}>✅ Competência Concluída</Text>
        )}
      </View>

      {/* Tags */}
      {skill.tags.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {skill.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Informações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Criado em:</Text>
          <Text style={styles.infoValue}>
            {skill.createdAt.toLocaleDateString('pt-BR')}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Última atualização:</Text>
          <Text style={styles.infoValue}>
            {skill.updatedAt.toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>

      {/* Histórico de Progresso */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histórico de Progresso</Text>
        {progressHistory.length > 0 ? (
          progressHistory.slice(0, 5).map((update, index) => (
            <View key={update.id} style={styles.historyItem}>
              <Text style={styles.historyDate}>
                {update.date.toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.historyProgress}>
                {update.progress}%
              </Text>
              {update.notes && (
                <Text style={styles.historyNotes}>{update.notes}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noHistory}>Nenhum registro de progresso.</Text>
        )}
      </View>

      {/* Ações */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => setProgressModalVisible(true)}
        >
          <Text style={styles.actionButtonText}>Atualizar Progresso</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleEditSkill}
        >
          <Text style={styles.actionButtonText}>Editar Competência</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleDeleteSkill}
        >
          <Text style={styles.actionButtonText}>Excluir Competência</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para atualizar progresso */}
      <Modal
        visible={progressModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProgressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atualizar Progresso</Text>
            
            <Text style={styles.modalLabel}>Progresso Atual (%)</Text>
            <TextInput
              style={styles.modalInput}
              value={newProgress}
              onChangeText={setNewProgress}
              keyboardType="numeric"
              placeholder="0-100"
            />
            
            <Text style={styles.modalLabel}>Notes (Opcional)</Text>
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              value={progressNotes}
              onChangeText={setProgressNotes}
              placeholder="Ex: Completei o curso básico..."
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setProgressModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleUpdateProgress}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  targetText: {
    fontSize: 14,
    color: '#666',
  },
  completedText: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '600',
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
  historyProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196f3',
    marginVertical: 4,
  },
  historyNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  noHistory: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionsSection: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196f3',
  },
  secondaryButton: {
    backgroundColor: '#ff9800',
  },
  dangerButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#2196f3',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});