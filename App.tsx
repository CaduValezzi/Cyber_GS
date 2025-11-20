import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SkillProvider } from './src/context/SkillContext';

export default function App() {
  return (
    <SkillProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SkillProvider>
  );
}
// import React, { useEffect } from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { AppNavigator } from './src/navigation/AppNavigator';
// import { SkillProvider } from './src/context/SkillContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function App() {
//   useEffect(() => {
//     const clearStorageOnStart = async () => {
//       try {
//         await AsyncStorage.clear();
//         console.log('STORAGE LIMPO!');
//       } catch (error) {
//         console.log('Erro ao limpar storage:', error);
//       }
//     };

//     clearStorageOnStart();
//   }, []);

//   return (
//     <SkillProvider>
//       <StatusBar style="auto" />
//       <AppNavigator />
//     </SkillProvider>
//   );
// }