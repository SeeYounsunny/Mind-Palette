import React from 'react';
import { Home, Video, BarChart3 } from 'lucide-react';

const BottomNavigation = ({ currentTab, onTabChange }) => {
  return (
    <div className="bottom-navigation">
      <button
        className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabChange('home')}
      >
        <Home size={24} />
        <span>홈</span>
      </button>
      <button
        className={`nav-item ${currentTab === 'write' ? 'active' : ''}`}
        onClick={() => onTabChange('write')}
      >
        <Video size={24} />
        <span>일기쓰기</span>
      </button>
      <button
        className={`nav-item ${currentTab === 'emotion' ? 'active' : ''}`}
        onClick={() => onTabChange('emotion')}
      >
        <BarChart3 size={24} />
        <span>감정 보기</span>
      </button>
    </div>
  );
};

export default BottomNavigation;


