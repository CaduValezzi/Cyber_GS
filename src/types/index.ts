import { NativeStackNavigationProp } from '@react-navigation/native-stack';
export type SkillCategory = 'soft' | 'hard';
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type AddEditSkillScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddEditSkill'>;
export type SkillDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SkillDetails'>;
export type StatisticsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Statistics'>;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  currentProgress: number; 
  targetProgress?: number; 
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}

export interface ProgressUpdate {
  id: string;
  skillId: string;
  progress: number; 
  date: Date;
  notes?: string;
}

export type RootStackParamList = {
  Home: undefined;
  AddEditSkill: { skillId?: string };
  SkillDetails: { skillId: string };
  Statistics: undefined;
};
