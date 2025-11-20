import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useSkill } from '../context/SkillContext';
import { Skill, SkillCategory, RootStackParamList } from '../types';

type AddEditSkillScreenRouteProp = RouteProp<RootStackParamList, 'AddEditSkill'>;

interface AddEditSkillScreenProps {
  navigation: any;
  route: AddEditSkillScreenRouteProp;
}

export const AddEditSkillScreen: React.FC<AddEditSkillScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { skills, addSkill, updateSkill } = useSkill();
  const { skillId } = route.params || {};

  const isEditing = !!skillId;
  const skillToEdit = skills.find(skill => skill.id === skillId);

  // Estado do formulário
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('soft');
  const [description, setDescription] = useState('');
  const [currentProgress, setCurrentProgress] = useState('0');
  const [targetProgress, setTargetProgress] = useState('');
  const [tags, setTags] = useState('');

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (skillToEdit) {
      setName(skillToEdit.name);
      setCategory(skillToEdit.category);
      setDescription(skillToEdit.description);
      setCurrentProgress(skillToEdit.currentProgress.toString());
      setTargetProgress(skillToEdit.targetProgress?.toString() || '');
      setTags(skillToEdit.tags.join(', '));
    }
  }, [skillToEdit]);

  // No handleSave, atualizar para:
  const handleSave = () => {
    // Validação básica
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, digite um nome para a competência');
      return;
    }
  
    const progressValue = parseInt(currentProgress) || 0;
    const targetValue = targetProgress ? parseInt(targetProgress) : undefined;
  
    const skillData = {
      name: name.trim(),
      category,
      description: description.trim(),
      currentProgress: progressValue,
      targetProgress: targetValue,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isCompleted: progressValue === 100,
    };
  
    if (isEditing && skillToEdit) {
      updateSkill(skillToEdit.id, skillData);
      Alert.alert('Sucesso', 'Competência atualizada com sucesso!');
    } else {
      addSkill(skillData);
      Alert.alert('Sucesso', 'Competência adicionada com sucesso!');
    }
  
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? 'Editar Competência' : 'Nova Competência'}
      </Text>

      {/* Nome */}
      <View style={styles.field}>
        <Text style={styles.label}>Nome da Competência *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: TypeScript, Comunicação, Gestão do Tempo"
        />
      </View>

      {/* Categoria */}
      <View style={styles.field}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              category === 'soft' && styles.categoryButtonSelected
            ]}
            onPress={() => setCategory('soft')}
          >
            <Text style={[
              styles.categoryButtonText,
              category === 'soft' && styles.categoryButtonTextSelected
            ]}>
              Soft Skill
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              category === 'hard' && styles.categoryButtonSelected
            ]}
            onPress={() => setCategory('hard')}
          >
            <Text style={[
              styles.categoryButtonText,
              category === 'hard' && styles.categoryButtonTextSelected
            ]}>
              Hard Skill
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Descrição */}
      <View style={styles.field}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descreva esta competência..."
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Progresso Atual */}
      <View style={styles.field}>
        <Text style={styles.label}>Progresso Atual (%)</Text>
        <TextInput
          style={styles.input}
          value={currentProgress}
          onChangeText={setCurrentProgress}
          placeholder="0"
          keyboardType="numeric"
        />
      </View>

      {/* Progresso Meta */}
      <View style={styles.field}>
        <Text style={styles.label}>Progresso Meta (%)</Text>
        <TextInput
          style={styles.input}
          value={targetProgress}
          onChangeText={setTargetProgress}
          placeholder="100 (opcional)"
          keyboardType="numeric"
        />
      </View>

      {/* Tags */}
      <View style={styles.field}>
        <Text style={styles.label}>Tags</Text>
        <TextInput
          style={styles.input}
          value={tags}
          onChangeText={setTags}
          placeholder="programação, frontend, typescript (separadas por vírgula)"
        />
      </View>

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Atualizar' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  categoryButtonSelected: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2196f3',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});