import React from 'react';
import { GameProvider } from './context/GameContext';
import { MainGameLayout } from './components/MainGameLayout';

export default function App() {
  return (
    <GameProvider>
      <MainGameLayout />
    </GameProvider>
  );
}
