// App.tsx
import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import GameScreen from './GameScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <GameScreen />
    </SafeAreaView>
  );
};

export default App;
