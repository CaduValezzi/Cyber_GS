import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SkillCategory } from '../types';

interface CategoryBadgeProps {
  category: SkillCategory;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getCategoryInfo = (cat: SkillCategory) => {
    switch (cat) {
      case 'soft':
        return { 
          label: 'Soft Skill', 
          color: '#ffb74d', // Laranja
          textColor: '#fff'
        };
      case 'hard':
        return { 
          label: 'Hard Skill', 
          color: '#4fc3f7', // Azul
          textColor: '#fff'
        };
      default:
        return { 
          label: 'Desconhecido', 
          color: '#9e9e9e',
          textColor: '#fff'
        };
    }
  };

  const { label, color, textColor } = getCategoryInfo(category);

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start', 
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});