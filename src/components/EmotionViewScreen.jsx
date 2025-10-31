import React, { useState, useEffect, useMemo } from 'react';
import { Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import SharePreviewModal from './SharePreviewModal.jsx';

const STORAGE_KEY = 'mind-palette-data';

const EmotionViewScreen = () => {
  const [savedEntries, setSavedEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showShareModal, setShowShareModal] = useState(false);

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

  const monthPrefix = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, [currentDate]);

  const monthlyEntries = useMemo(() => {
    return savedEntries.filter(e => e.date?.startsWith(monthPrefix));
  }, [savedEntries, monthPrefix]);

  // 분석 데이터 계산 (월 기준)
  const analysisData = useMemo(() => {
    const source = monthlyEntries;
    if (!source || source.length === 0) return null;

    // 총 기록 일수 (중복 날짜 제거)
    const uniqueDates = new Set(source.map(e => e.date));
    const totalDays = uniqueDates.size;

    // 감정별 카운트
    const emotionCount = {};
    const emotionColors = {}; // 감정별 사용한 색상들

    source.forEach(entry => {
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
    source.forEach(entry => {
      if (entry.color) {
        colorCount[entry.color] = (colorCount[entry.color] || 0) + 1;
      }
    });

    // 색상 사용률 계산
    const totalColorUses = source.filter(e => e.color).length;
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
  }, [monthlyEntries]);

  const monthName = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  const changeMonth = (direction) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + direction);
      return d;
    });
  };

  if (!savedEntries || savedEntries.length === 0) {
    return (
      <div className="emotion-view-screen">
        <div className="emotion-view-container">
          <div className="emotion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="emotion-main-title">나의 마음 팔레트</h1>
            <p className="emotion-subtitle">색으로 나의 감정을 들여다봐요</p>
            <button className="share-btn-small" aria-label="공유" onClick={() => setShowShareModal(true)}>
              <Share2 size={16} />
              <span>공유</span>
            </button>
          </div>
          <div className="month-navigation">
            <button onClick={() => changeMonth(-1)} className="month-arrow"><ChevronLeft size={20} /></button>
            <div className="month-name">{monthName}</div>
            <button onClick={() => changeMonth(1)} className="month-arrow"><ChevronRight size={20} /></button>
          </div>
          <div className="emotion-empty-state">
            <p className="empty-message">아직 분석할 데이터가 없습니다.</p>
            <p className="empty-submessage">일기를 더 작성해보세요!</p>
          </div>
        </div>

        {/* 공유 미리보기 모달 */}
        <SharePreviewModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onSave={async (element) => {
            try {
              const html2canvas = (await import('html2canvas')).default;
              const canvas = await html2canvas(element, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
              });
              const dataUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = `나의_${currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}_감정팔레트.png`;
              link.href = dataUrl;
              link.click();
              setShowShareModal(false);
            } catch (error) {
              console.error('이미지 저장 실패:', error);
              alert('이미지 저장 중 오류가 발생했습니다.');
            }
          }}
          monthlyEntries={[]}
          currentDate={currentDate}
          topEmotions={[]}
        />
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
            <button className="share-btn-small" aria-label="공유" onClick={() => setShowShareModal(true)}>
              <Share2 size={16} />
              <span>공유</span>
            </button>
        </div>

        {/* 월 선택기 */}
        <div className="month-navigation">
          <button onClick={() => changeMonth(-1)} className="month-arrow"><ChevronLeft size={20} /></button>
          <div className="month-name">{monthName}</div>
          <button onClick={() => changeMonth(1)} className="month-arrow"><ChevronRight size={20} /></button>
        </div>

        {/* 통계 카드 (3개) */}
        <div className="emotion-stats-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card stat-card-left">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">📅</span>
              <span className="stat-label">총 기록</span>
            </div>
            <div className="stat-value-large">{analysisData.totalDays}일</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">😊</span>
              <span className="stat-label">최다 감정</span>
            </div>
            <div className="stat-value-large stat-one-line">{analysisData.mostFrequentEmotion || '-'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">🎨</span>
              <span className="stat-label">끌리는 색</span>
            </div>
            <div className="stat-value-large" style={{ fontSize: '1rem' }}>{analysisData.topColors?.[0]?.color?.toUpperCase() || '-'}</div>
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

        {/* 자주 느낀 감정 분포도 (요약 도트) */}
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
                  {emotionData.colors.slice(0, 24).map((color, colorIndex) => (
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

        {/* 즐겨 쓰는 시간대 */}
        <div className="weekly-trend-section">
          <h3 className="section-title">즐겨 쓰는 시간대</h3>
          <div className="frequent-emotions-list">
            {['새벽 (04:00-06:00)','아침 (06:00-09:00)','오전 (09:00-12:00)','점심 (12:00-14:00)','오후 (14:00-17:00)','저녁 (17:00-20:00)','밤 (20:00-24:00)','심야 (24:00-04:00)'].map((slot) => {
              const slotEntries = monthlyEntries.filter(e => e.timeOfDay === slot);
              const colors = slotEntries.map(e => e.color).filter(Boolean).slice(0,24);
              return (
                <div key={slot} className="frequent-emotion-item">
                  <div className="emotion-info-row">
                    <div className="emotion-name-count">
                      <span className="emotion-name-text">{slot.split(' ')[0]}</span>
                      <span className="emotion-count-text">{slotEntries.length}회</span>
                    </div>
                  </div>
                  <div className="emotion-colors-list">
                    {colors.map((c, i) => (
                      <div key={i} className="emotion-color-dot" style={{ backgroundColor: c || '#e5e7eb' }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 영향받는 날씨 */}
        <div className="weekly-trend-section">
          <h3 className="section-title">영향받는 날씨</h3>
          <div className="frequent-emotions-list">
            {['맑다','흐리다','비가 온다','바람이 분다','눈이 온다','기타'].map((w) => {
              const wEntries = monthlyEntries.filter(e => e.weather === w);
              const colors = wEntries.map(e => e.color).filter(Boolean).slice(0,24);
              return (
                <div key={w} className="frequent-emotion-item">
                  <div className="emotion-info-row">
                    <div className="emotion-name-count">
                      <span className="emotion-name-text">{w}</span>
                      <span className="emotion-count-text">{wEntries.length}회</span>
                    </div>
                  </div>
                  <div className="emotion-colors-list">
                    {colors.map((c, i) => (
                      <div key={i} className="emotion-color-dot" style={{ backgroundColor: c || '#e5e7eb' }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 공유 미리보기 모달 */}
      <SharePreviewModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onSave={async (element) => {
          try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(element, {
              backgroundColor: null,
              scale: 2,
              useCORS: true,
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `나의_${currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}_감정팔레트.png`;
            link.href = dataUrl;
            link.click();
            setShowShareModal(false);
          } catch (error) {
            console.error('이미지 저장 실패:', error);
            alert('이미지 저장 중 오류가 발생했습니다.');
          }
        }}
        monthlyEntries={monthlyEntries}
        currentDate={currentDate}
        topEmotions={analysisData?.frequentEmotions?.slice(0, 5).map(e => e.emotion) || []}
      />
    </div>
  );
};

export default EmotionViewScreen;
