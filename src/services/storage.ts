import AsyncStorage from '@react-native-async-storage/async-storage';
import { Skill, ProgressUpdate } from '../types';

// Chaves para armazenamento
const SKILLS_STORAGE_KEY = '@skillmapper:skills';
const PROGRESS_UPDATES_STORAGE_KEY = '@skillmapper:progress_updates';

// Serviço para gerenciar skills
export const storageService = {
  // Skills
  async getSkills(): Promise<Skill[]> {
    try {
      const data = await AsyncStorage.getItem(SKILLS_STORAGE_KEY);
      if (data) {
        const skills = JSON.parse(data);
        // Convertendo strings de data para objetos Date
        return skills.map((skill: any) => ({
          ...skill,
          createdAt: new Date(skill.createdAt),
          updatedAt: new Date(skill.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar skills:', error);
      return [];
    }
  },

  async saveSkills(skills: Skill[]): Promise<void> {
    try {
      await AsyncStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(skills));
    } catch (error) {
      console.error('Erro ao salvar skills:', error);
    }
  },

  // Progress Updates
  async getProgressUpdates(): Promise<ProgressUpdate[]> {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_UPDATES_STORAGE_KEY);
      if (data) {
        const progressUpdates = JSON.parse(data);
        return progressUpdates.map((update: any) => ({
          ...update,
          date: new Date(update.date),
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar progress updates:', error);
      return [];
    }
  },

  async saveProgressUpdates(updates: ProgressUpdate[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PROGRESS_UPDATES_STORAGE_KEY, JSON.stringify(updates));
    } catch (error) {
      console.error('Erro ao salvar progress updates:', error);
    }
  },
};