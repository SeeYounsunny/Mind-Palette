import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'mind-palette-data';

const HomeScreen = () => {
  const [savedEntries, setSavedEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // LocalStorage에서 데이터 로드
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSavedEntries(parsedData);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // 연속 기록 일수 계산
  const calculateConsecutiveDays = () => {
    if (savedEntries.length === 0) return 0;
    
    const sortedEntries = [...savedEntries].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    let consecutive = 1;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // 오늘 기록이 있으면 확인 시작
    const todayHasEntry = sortedEntries.some(e => e.date === today);
    if (!todayHasEntry) {
      return 0;
    }
    
    let checkDate = yesterday;
    while (true) {
      const hasEntry = sortedEntries.some(e => e.date === checkDate);
      if (hasEntry) {
        consecutive++;
        checkDate = new Date(new Date(checkDate).getTime() - 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0];
      } else {
        break;
      }
    }
    
    return consecutive;
  };

  // 최근 7일 요약 데이터
  const getWeeklySummary = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayEntries = savedEntries.filter(e => e.date === dateString);
      const colors = dayEntries.map(e => e.color).filter(c => c);
      
      weekData.push({
        date: dateString,
        day: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()],
        hasEntry: dayEntries.length > 0,
        primaryColor: colors[0] || null
      });
    }
    
    return weekData;
  };

  // 캘린더 데이터 생성
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // padStart 헬퍼 함수
    const pad = (num) => String(num).padStart(2, '0');

    // 이전 달 마지막 날들
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      const dateString = `${prevDate.getFullYear()}-${pad(prevDate.getMonth() + 1)}-${pad(prevDate.getDate())}`;
      const dayEntries = savedEntries.filter(e => e.date === dateString);
      days.push({
        day: prevMonthLastDay - i,
        dateString,
        entries: dayEntries,
        isCurrentMonth: false
      });
    }

    // 현재 달 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${pad(month + 1)}-${pad(day)}`;
      const dayEntries = savedEntries.filter(e => e.date === dateString);
      days.push({
        day,
        dateString,
        entries: dayEntries,
        isCurrentMonth: true
      });
    }

    // 다음 달 첫 날들 (캘린더를 6주로 채우기 위해)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      const dateString = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())}`;
      const dayEntries = savedEntries.filter(e => e.date === dateString);
      days.push({
        day,
        dateString,
        entries: dayEntries,
        isCurrentMonth: false
      });
    }

    return days;
  };

  const consecutiveDays = calculateConsecutiveDays();
  const weeklySummary = getWeeklySummary();
  const calendarDays = generateCalendar();

  const monthName = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  const changeMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <div className="home-screen">
      {/* 배경 그라데이션 */}
      <div className="home-background" />
      
      {/* 상단 제목 */}
      <h1 className="app-title">Mind Palette</h1>

      {/* 30 Days 카드 */}
      <div className="days-card">
        <div className="days-number">{consecutiveDays}</div>
        <div className="days-label">Days</div>
      </div>

      {/* 주간 요약 */}
      <div className="weekly-summary">
        {weeklySummary.map((day, index) => (
          <div key={index} className="week-day">
            <div 
              className={`week-circle ${day.hasEntry ? 'filled' : 'empty'}`}
              style={day.primaryColor ? { backgroundColor: day.primaryColor } : {}}
            />
            <div className="week-day-label">{day.day}</div>
          </div>
        ))}
      </div>

      {/* 격려 메시지 */}
      {consecutiveDays > 0 && (
        <div className="encouragement-message">
          계속해서 감정을 기록하고 있어요. 멋져요! ✨
        </div>
      )}

      {/* 월 네비게이션 */}
      <div className="month-navigation">
        <button onClick={() => changeMonth(-1)} className="month-arrow">
          <ChevronLeft size={20} />
        </button>
        <div className="month-name">{monthName}</div>
        <button onClick={() => changeMonth(1)} className="month-arrow">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 캘린더 */}
      <div className="calendar-container">
        <div className="calendar-weekdays">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div key={index} className="weekday-label">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {calendarDays.map((dayData, index) => (
            <div
              key={index}
              className={`calendar-day ${!dayData.isCurrentMonth ? 'other-month' : ''}`}
            >
              {dayData.isCurrentMonth ? (
                dayData.entries.length > 0 ? (
                  <div
                    className="calendar-day-circle"
                    style={{ backgroundColor: dayData.entries[0].color }}
                  />
                ) : (
                  <div className="calendar-day-number">{dayData.day}</div>
                )
              ) : (
                <div className="calendar-day-number other-month">{dayData.day}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;

