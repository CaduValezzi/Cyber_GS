import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Skill, ProgressUpdate } from '../types';
import { storageService } from '../services/storageService';

// Definimos o tipo para o contexto
interface SkillContextData {
  skills: Skill[];
  progressUpdates: ProgressUpdate[];
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  addProgressUpdate: (update: Omit<ProgressUpdate, 'id' | 'date'>) => void;
  getProgressUpdatesForSkill: (skillId: string) => ProgressUpdate[];
}

// Criamos o contexto
const SkillContext = createContext<SkillContextData>({} as SkillContextData);

// Props do Provider
interface SkillProviderProps {
  children: ReactNode;
}

// Provider component
export const SkillProvider: React.FC<SkillProviderProps> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);

  // Carregar dados do AsyncStorage ao iniciar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [loadedSkills, loadedProgressUpdates] = await Promise.all([
      storageService.getSkills(),
      storageService.getProgressUpdates(),
    ]);
    setSkills(loadedSkills);
    setProgressUpdates(loadedProgressUpdates);
  };

  // Gera um ID único
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Adicionar uma nova skill
  const addSkill = (skillData: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSkill: Skill = {
      ...skillData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newSkills = [...skills, newSkill];
    setSkills(newSkills);
    storageService.saveSkills(newSkills);
  };

  // Atualizar uma skill existente
  const updateSkill = (id: string, skillData: Partial<Skill>) => {
    const updatedSkills = skills.map(skill => {
      if (skill.id === id) {
        return { ...skill, ...skillData, updatedAt: new Date() };
      }
      return skill;
    });
    setSkills(updatedSkills);
    storageService.saveSkills(updatedSkills);
  };

  // Deletar uma skill
  const deleteSkill = (id: string) => {
    const filteredSkills = skills.filter(skill => skill.id !== id);
    setSkills(filteredSkills);
    storageService.saveSkills(filteredSkills);

    // Também remove os progress updates associados
    const filteredProgressUpdates = progressUpdates.filter(update => update.skillId !== id);
    setProgressUpdates(filteredProgressUpdates);
    storageService.saveProgressUpdates(filteredProgressUpdates);
  };

  // Adicionar um progress update
  const addProgressUpdate = (updateData: Omit<ProgressUpdate, 'id' | 'date'>) => {
    const newProgressUpdate: ProgressUpdate = {
      ...updateData,
      id: generateId(),
      date: new Date(),
    };
    const newProgressUpdates = [...progressUpdates, newProgressUpdate];
    setProgressUpdates(newProgressUpdates);
    storageService.saveProgressUpdates(newProgressUpdates);

    // Atualiza o progresso atual na skill
    updateSkill(updateData.skillId, { currentProgress: updateData.progress });
  };

  // Obter progress updates de uma skill específica
  const getProgressUpdatesForSkill = (skillId: string): ProgressUpdate[] => {
    return progressUpdates.filter(update => update.skillId === skillId)
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Mais recentes primeiro
  };

  // Valor do contexto
  const contextValue: SkillContextData = {
    skills,
    progressUpdates,
    addSkill,
    updateSkill,
    deleteSkill,
    addProgressUpdate,
    getProgressUpdatesForSkill,
  };

  return (
    <SkillContext.Provider value={contextValue}>
      {children}
    </SkillContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useSkill = (): SkillContextData => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error('useSkill deve ser usado dentro de um SkillProvider');
  }
  return context;
};