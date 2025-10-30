import React, { useState } from 'react';
import HomeScreen from './HomeScreen';
import BottomNavigation from './BottomNavigation';
import DiaryWriteScreen from './DiaryWriteScreen';
import EmotionViewScreen from './EmotionViewScreen';

const ColorDiaryAppFigma = () => {
  const [currentTab, setCurrentTab] = useState('home');

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const handleDiaryClose = () => {
    setCurrentTab('home');
  };

  return (
    <div className="figma-app">
      <div className="app-content">
        {currentTab === 'home' && <HomeScreen onNavigateToWrite={() => setCurrentTab('write')} />}
        {currentTab === 'write' && <DiaryWriteScreen onClose={handleDiaryClose} />}
        {currentTab === 'emotion' && <EmotionViewScreen />}
      </div>
      <BottomNavigation currentTab={currentTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default ColorDiaryAppFigma;

