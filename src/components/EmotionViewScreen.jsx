import React, { useState, useEffect, useMemo } from 'react';
import { Share2 } from 'lucide-react';

const STORAGE_KEY = 'mind-palette-data';

const EmotionViewScreen = () => {
  const [savedEntries, setSavedEntries] = useState([]);

  // 데이터 로드 함수
  const loadSavedEntries = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSavedEntries(parsedData || []);
      } catch (error) {
        console.error('Failed to load saved data:', error);
        setSavedEntries([]);
      }
    } else {
      setSavedEntries([]);
    }
  };

  useEffect(() => {
    loadSavedEntries();

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        loadSavedEntries();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      loadSavedEntries();
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 분석 데이터 계산
  const analysisData = useMemo(() => {
    if (!savedEntries || savedEntries.length === 0) return null;

    // 총 기록 일수 (중복 날짜 제거)
    const uniqueDates = new Set(savedEntries.map(e => e.date));
    const totalDays = uniqueDates.size;

    // 감정별 카운트
    const emotionCount = {};
    const emotionColors = {}; // 감정별 사용한 색상들

    savedEntries.forEach(entry => {
      if (entry.emotion) {
        emotionCount[entry.emotion] = (emotionCount[entry.emotion] || 0) + 1;
        if (entry.color) {
          if (!emotionColors[entry.emotion]) {
            emotionColors[entry.emotion] = [];
          }
          emotionColors[entry.emotion].push(entry.color);
        }
      }
    });

    // 최다 감정
    const mostFrequentEmotion = Object.keys(emotionCount).reduce((a, b) =>
      emotionCount[a] > emotionCount[b] ? a : b, Object.keys(emotionCount)[0] || ''
    );

    // 색상별 사용 횟수
    const colorCount = {};
    savedEntries.forEach(entry => {
      if (entry.color) {
        colorCount[entry.color] = (colorCount[entry.color] || 0) + 1;
      }
    });

    // 색상 사용률 계산
    const totalColorUses = savedEntries.filter(e => e.color).length;
    const topColors = Object.entries(colorCount)
      .map(([color, count]) => ({
        color,
        count,
        percentage: Math.round((count / totalColorUses) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 자주 느낀 감정 (최소 2회 이상)
    const frequentEmotions = Object.entries(emotionCount)
      .map(([emotion, count]) => ({
        emotion,
        count,
        colors: emotionColors[emotion] || []
      }))
      .filter(e => e.count >= 2)
      .sort((a, b) => b.count - a.count);

    // 주간 기록 추이 (최근 7주)
    const weeklyTrend = [];
    const now = new Date();
    for (let week = 6; week >= 0; week--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (week * 7 + 6));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - (week * 7));
      weekEnd.setHours(23, 59, 59, 999);

      const weekEntries = savedEntries.filter(entry => {
        if (!entry.date) return false;
        const entryDate = new Date(entry.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
      });

      const weekUniqueDates = new Set(weekEntries.map(e => e.date));
      weeklyTrend.push({
        week: week + 1,
        days: weekUniqueDates.size
      });
    }

    return {
      totalDays,
      mostFrequentEmotion,
      topColors,
      frequentEmotions,
      weeklyTrend
    };
  }, [savedEntries]);

  if (!savedEntries || savedEntries.length === 0) {
    return (
      <div className="emotion-view-screen">
        <div className="emotion-view-container">
          <div className="emotion-header">
            <h1 className="emotion-main-title">나의 마음 팔레트</h1>
            <p className="emotion-subtitle">색으로 나의 감정을 들여다봐요</p>
          </div>
          <div className="emotion-empty-state">
            <p className="empty-message">아직 분석할 데이터가 없습니다.</p>
            <p className="empty-submessage">일기를 더 작성해보세요!</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="emotion-view-screen">
        <div className="emotion-view-container">
          <div className="emotion-header">
            <h1 className="emotion-main-title">나의 마음 팔레트</h1>
            <p className="emotion-subtitle">색으로 나의 감정을 들여다봐요</p>
          </div>
          <div className="emotion-empty-state">
            <p className="empty-message">데이터를 분석 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="emotion-view-screen">
      <div className="emotion-view-container">
        {/* 헤더 */}
        <div className="emotion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="emotion-main-title">나의 마음 팔레트</h1>
            <p className="emotion-subtitle">색으로 나의 감정을 들여다봐요</p>
          </div>
          <button className="share-btn-small" aria-label="공유">
            <Share2 size={16} />
            <span>공유</span>
          </button>
        </div>

        {/* 통계 카드 */}
        <div className="emotion-stats-cards">
          <div className="stat-card stat-card-left">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">📅</span>
              <span className="stat-label">총 기록</span>
            </div>
            <div className="stat-value-large">{analysisData.totalDays}일</div>
          </div>
          <div className="stat-card stat-card-right">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">📈</span>
              <span className="stat-label">최다 감정</span>
            </div>
            <div className="stat-value-large">{analysisData.mostFrequentEmotion || '-'}</div>
          </div>
        </div>

        {/* 감정 컬러 팔레트 */}
        <div className="emotion-color-palette-section">
          <div className="section-header-row">
            <h3 className="section-title">감정 컬러 팔레트</h3>
          </div>
          <div className="color-palette-grid">
            {analysisData.topColors.map((colorData, index) => (
              <div key={index} className="color-palette-item">
                <div
                  className="color-palette-circle"
                  style={{ backgroundColor: colorData.color }}
                />
                <div className="color-palette-info">
                  <div className="color-palette-count">{colorData.count}회</div>
                  <div className="color-palette-percentage">{colorData.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
          {/* 색상 비율 바 제거 */}
        </div>

        {/* 자주 느낀 감정 */}
        <div className="frequent-emotions-section">
          <h3 className="section-title">자주 느낀 감정</h3>
          <div className="frequent-emotions-list">
            {analysisData.frequentEmotions.map((emotionData, index) => (
              <div key={index} className="frequent-emotion-item">
                <div className="emotion-info-row">
                  <div className="emotion-name-count">
                    <span className="emotion-name-text">{emotionData.emotion}</span>
                    <span className="emotion-count-text">{emotionData.count}회</span>
                  </div>
                </div>
                <div className="emotion-colors-list">
                  {emotionData.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="emotion-color-dot"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 주간 기록 추이 */}
        <div className="weekly-trend-section">
          <h3 className="section-title">주간 기록 추이</h3>
          <div className="weekly-trend-grid">
            {analysisData.weeklyTrend.map((week, index) => (
              <div key={index} className="weekly-trend-item">
                <div className="weekly-trend-days">{week.days}일</div>
                <div className="weekly-trend-label">{week.week}주</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionViewScreen;
