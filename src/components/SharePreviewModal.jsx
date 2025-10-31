import React, { useRef } from 'react';
import { X, Download } from 'lucide-react';

const SharePreviewModal = ({ isOpen, onClose, onSave, monthlyEntries, currentDate, topEmotions }) => {
  const contentRef = useRef(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (onSave) {
      await onSave(contentRef.current);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  // 캘린더 생성
  const generateCalendar = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // 이전 달 마지막 날들
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      const dateString = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`;
      const dayEntries = monthlyEntries.filter(e => e.date === dateString);
      days.push({
        day: prevMonthLastDay - i,
        dateString,
        entries: dayEntries,
        isCurrentMonth: false
      });
    }

    // 현재 달 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEntries = monthlyEntries.filter(e => e.date === dateString);
      days.push({
        day,
        dateString,
        entries: dayEntries,
        isCurrentMonth: true
      });
    }

    // 다음 달 첫 날들
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      const dateString = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
      const dayEntries = monthlyEntries.filter(e => e.date === dateString);
      days.push({
        day,
        dateString,
        entries: dayEntries,
        isCurrentMonth: false
      });
    }

    return days;
  };

  const calendarDays = generateCalendar();

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h2 className="share-modal-title">공유 미리보기</h2>
          <button className="share-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="share-modal-body" ref={contentRef}>
          <h3 className="share-preview-title">나의 {monthName} 감정 팔레트</h3>

          {/* 캘린더 */}
          <div className="share-calendar">
            <div className="share-calendar-weekdays">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div key={index} className="share-weekday-label">{day}</div>
              ))}
            </div>
            <div className="share-calendar-grid">
              {calendarDays.map((dayData, index) => (
                <div key={index} className={`share-calendar-day ${!dayData.isCurrentMonth ? 'other-month' : ''}`}>
                  {dayData.isCurrentMonth ? (
                    dayData.entries.length > 0 ? (
                      <div
                        className="share-calendar-day-circle"
                        style={{ backgroundColor: dayData.entries[0].color }}
                      >
                        <span className="share-calendar-day-number">{dayData.day}</span>
                      </div>
                    ) : (
                      <div className="share-calendar-day-number">{dayData.day}</div>
                    )
                  ) : (
                    <div className="share-calendar-day-number other-month">{dayData.day}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 이 달의 감정 */}
          {topEmotions && topEmotions.length > 0 && (
            <div className="share-emotions-section">
              <h4 className="share-emotions-title">이 달의 감정</h4>
              <div className="share-emotions-tags">
                {topEmotions.map((emotion, index) => (
                  <span key={index} className="share-emotion-tag">{emotion}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="share-modal-footer">
          <button className="share-cancel-btn" onClick={onClose}>취소</button>
          <button className="share-save-btn" onClick={handleSave}>
            <Download size={18} />
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePreviewModal;

