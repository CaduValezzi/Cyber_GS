import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Skill, ProgressUpdate } from '../types';
import { storageService } from '../services/storageService';

interface SkillContextData {
  skills: Skill[];
  progressUpdates: ProgressUpdate[];
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  addProgressUpdate: (update: Omit<ProgressUpdate, 'id' | 'date'>) => void;
  getProgressUpdatesForSkill: (skillId: string) => ProgressUpdate[];
  reloadData: () => Promise<void>; // 👈 ADICIONAR ESTA LINHA
}

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

  const loadData = useCallback(async () => {
    try {
      const [loadedSkills, loadedProgressUpdates] = await Promise.all([
        storageService.getSkills(),
        storageService.getProgressUpdates(),
      ]);
      console.log('Dados carregados - Skills:', loadedSkills.length);
      setSkills(loadedSkills);
      setProgressUpdates(loadedProgressUpdates);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }, []);

  // Gera um ID único
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Adicionar uma nova skill - usando useCallback para evitar recreação
  const addSkill = useCallback((skillData: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSkill: Skill = {
      ...skillData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setSkills(prevSkills => {
      const newSkills = [...prevSkills, newSkill];
      storageService.saveSkills(newSkills);
      return newSkills;
    });
  }, []);

  // Atualizar uma skill existente
  const updateSkill = useCallback((id: string, skillData: Partial<Skill>) => {
    setSkills(prevSkills => {
      const updatedSkills = prevSkills.map(skill => {
        if (skill.id === id) {
          return { ...skill, ...skillData, updatedAt: new Date() };
        }
        return skill;
      });
      storageService.saveSkills(updatedSkills);
      return updatedSkills;
    });
  }, []);

  const deleteSkill = useCallback(async (id: string) => {
    console.log('🔴 EXCLUINDO SKILL ID:', id);
    
    setSkills(prevSkills => {
      const filteredSkills = prevSkills.filter(skill => skill.id !== id);
      console.log('Skills após exclusão:', filteredSkills.length);
      
      setProgressUpdates(prevUpdates => {
        const filteredProgressUpdates = prevUpdates.filter(update => update.skillId !== id);
        storageService.saveProgressUpdates(filteredProgressUpdates);
        return filteredProgressUpdates;
      });
      
      storageService.saveSkills(filteredSkills);
      return filteredSkills;
    });
  }, []);

  // Adicionar um progress update
  const addProgressUpdate = useCallback((updateData: Omit<ProgressUpdate, 'id' | 'date'>) => {
    const newProgressUpdate: ProgressUpdate = {
      ...updateData,
      id: generateId(),
      date: new Date(),
    };
    
    setProgressUpdates(prevUpdates => {
      const newProgressUpdates = [...prevUpdates, newProgressUpdate];
      storageService.saveProgressUpdates(newProgressUpdates);
      return newProgressUpdates;
    });

    // Atualiza o progresso atual na skill
    updateSkill(updateData.skillId, { 
      currentProgress: updateData.progress,
      isCompleted: updateData.progress === 100 
    });
  }, [updateSkill]);

  const getProgressUpdatesForSkill = useCallback((skillId: string): ProgressUpdate[] => {
    return progressUpdates
      .filter(update => update.skillId === skillId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [progressUpdates]);

  const reloadData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Valor do contexto
  const contextValue: SkillContextData = {
    skills,
    progressUpdates,
    addSkill,
    updateSkill,
    deleteSkill,
    addProgressUpdate,
    getProgressUpdatesForSkill,
    reloadData, // 👈 ADICIONAR AO CONTEXTO
  };

  return (
    <SkillContext.Provider value={contextValue}>
      {children}
    </SkillContext.Provider>
  );
};

export const useSkill = (): SkillContextData => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error('useSkill deve ser usado dentro de um SkillProvider');
  }
  return context;
};