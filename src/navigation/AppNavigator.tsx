import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import { HomeScreen } from '../screens/HomeScreen';
import { AddEditSkillScreen } from '../screens/AddEditSkillScreen';
import { SkillDetailsScreen } from '../screens/SkillDetailsScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196f3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Minhas Competências' }}
        />
        <Stack.Screen 
          name="AddEditSkill" 
          component={AddEditSkillScreen}
          options={{ title: 'Adicionar Competência' }}
        />
        <Stack.Screen 
          name="SkillDetails" 
          component={SkillDetailsScreen}
          options={{ title: 'Detalhes da Competência' }}
        />
        <Stack.Screen 
          name="Statistics" 
          component={StatisticsScreen}
          options={{ title: 'Estatísticas' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};