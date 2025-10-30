import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import GradientColorPicker from './GradientColorPicker.jsx';
import { storageManager } from '../data/storageManager.js';
import { EmotionEntry } from '../data/dataModels.js';

const STORAGE_KEY = 'mind-palette-data';

const DiaryWriteScreen = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [diaryData, setDiaryData] = useState({
    color: '',
    avoidColor: '',
    emotion: '',
    emotionIntensity: 3,
    episode: '',
    timeOfDay: '',
    weather: '',
    weatherFeeling: ''
  });
  const [savedEntries, setSavedEntries] = useState([]);
  const [customEmotion, setCustomEmotion] = useState('');
  const [customWeatherFeeling, setCustomWeatherFeeling] = useState('');

  // 33개 컬러 팔레트
  const colors = [
    '#FDD6D6', '#FFDAC7', '#F9F2A2', '#E0F5BA', '#B7EDB9',
    '#BBEAE2', '#B9EAF2', '#BCDFFF', '#D5CAF5', '#FFCBE9', '#FFFFFF',
    '#D32929', '#F46B06', '#FFD700', '#91C249', '#33A24F',
    '#4EA9B1', '#3A85B8', '#2356A7', '#7445A3', '#B93984', '#B2B2B2',
    '#7A0724', '#864F3A', '#84753C', '#5B8643', '#206340',
    '#256872', '#154D6F', '#0D295D', '#39155F', '#4F1040', '#000000'
  ];

  const emotions = [
    '기쁘다', '행복하다', '즐겁다', '뿌듯하다', '평온하다',
    '피곤하다', '화난다', '슬프다', '짜증난다', '불안하다', '우울하다', '기타'
  ];

  const timeOptions = [
    '새벽 (04:00-06:00)', '아침 (06:00-09:00)', '오전 (09:00-12:00)',
    '점심 (12:00-14:00)', '오후 (14:00-17:00)', '저녁 (17:00-20:00)',
    '밤 (20:00-24:00)', '심야 (24:00-04:00)'
  ];

  const weatherOptions = [
    '맑다', '흐리다', '비가 온다', '바람이 분다', '눈이 온다', '기타'
  ];

  const weatherFeelings = [
    '따뜻하다', '덥다', '후덥지근하다', '건조하다', '시원하다',
    '춥다', '서늘하다', '쌀쌀하다', '습하다', '기타'
  ];

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

  const calculateColorIntensity = (color) => {
    if (colors.slice(0, 11).includes(color)) return 80;
    if (colors.slice(11, 22).includes(color)) return 50;
    if (colors.slice(22, 33).includes(color)) return 20;
    return 50;
  };

  const handleNext = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSave = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = savedEntries.filter(entry => entry.date === today);

    if (todayEntries.length >= 4) {
      alert('하루에 최대 4개의 일기만 작성할 수 있습니다.');
      return;
    }

    const finalEmotion = diaryData.emotion === '기타' ? customEmotion : diaryData.emotion;
    const finalWeatherFeeling = diaryData.weatherFeeling === '기타' ? customWeatherFeeling : diaryData.weatherFeeling;

    try {
      const emotionEntry = new EmotionEntry({
        color: diaryData.color,
        emotion: finalEmotion,
        intensity: calculateColorIntensity(diaryData.color),
        episode: diaryData.episode,
        timeOfDay: diaryData.timeOfDay,
        weather: diaryData.weather,
        weatherFeeling: finalWeatherFeeling,
        customEmotion: finalEmotion === '기타' ? customEmotion : '',
        memo: diaryData.episode
      });

      const saveSuccess = storageManager.saveEmotionEntry(emotionEntry);

      if (saveSuccess) {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            setSavedEntries(parsedData);
            alert(`오늘의 ${todayEntries.length + 1}번째 일기가 저장되었습니다!`);
            
            // 초기화
            setCurrentPage(1);
            setDiaryData({
              color: '',
              avoidColor: '',
              emotion: '',
              emotionIntensity: 3,
              episode: '',
              timeOfDay: '',
              weather: '',
              weatherFeeling: ''
            });
            setCustomEmotion('');
            setCustomWeatherFeeling('');
          } catch (error) {
            console.error('데이터 로드 실패:', error);
          }
        }
      }
    } catch (error) {
      console.error('감정 기록 저장 실패:', error);
      alert('데이터 저장 중 오류가 발생했습니다.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="diary-write-screen">
      <div className="diary-write-container">
        {/* 상단 헤더 */}
        <div className="diary-header">
          <button className="diary-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
          <div className="diary-page-indicator">
            오늘의 일기 ({currentPage}/2)
          </div>
          <button className="diary-next-btn" disabled={currentPage >= 2 || !diaryData.color} onClick={handleNext}>
            다음 페이지
          </button>
        </div>

        {/* 날짜 표시 */}
        <div className="diary-date">
          <input type="date" value={today} readOnly className="diary-date-input" />
        </div>

        {currentPage === 1 && (
          <div className="diary-page-content">
            {/* 첫 번째 색상 선택 */}
            <div className="diary-color-section">
              <h3 className="diary-color-title">지금 마음에 끌리는 색 하나를 선택해주세요.</h3>
              <GradientColorPicker
                value={diaryData.color}
                onChange={(hex) => setDiaryData({ ...diaryData, color: hex })}
                height={140}
              />
            </div>

            {/* 두 번째 색상 선택 */}
            <div className="diary-color-section">
              <h3 className="diary-color-title">지금 마음에서 덜어내고 싶은 색 하나를 선택해주세요.</h3>
              <GradientColorPicker
                value={diaryData.avoidColor}
                onChange={(hex) => setDiaryData({ ...diaryData, avoidColor: hex })}
                height={140}
              />
            </div>
          </div>
        )}

        {currentPage === 2 && (
          <div className="diary-page-content">
            {/* 감정 선택 */}
            <div className="diary-section">
              <h3 className="diary-section-title">지금 느끼는 감정은?</h3>
              <div className="diary-emotion-grid">
                {emotions.map((emotion, index) => (
                  <button
                    key={index}
                    className={`diary-emotion-btn ${diaryData.emotion === emotion ? 'selected' : ''}`}
                    onClick={() => {
                      setDiaryData({ ...diaryData, emotion });
                      if (emotion !== '기타') setCustomEmotion('');
                    }}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
              {diaryData.emotion === '기타' && (
                <input
                  type="text"
                  placeholder="감정을 직접 입력해주세요"
                  value={customEmotion}
                  onChange={(e) => setCustomEmotion(e.target.value)}
                  className="diary-custom-input"
                />
              )}
            </div>

            {/* 시간대 선택 - 원형 배치 */}
            <div className="diary-section">
              <h3 className="diary-section-title">하루 중 어느 때인가요?</h3>
              <div className="time-wheel">
                <div className="time-wheel-center">시간대
                  <br />선택
                </div>
                {timeOptions.map((label, idx) => (
                  <button
                    key={label}
                    className={`time-wheel-item ${diaryData.timeOfDay === label ? 'selected' : ''}`}
                    style={{
                      '--tw-angle': `${(idx / timeOptions.length) * 360}deg`
                    }}
                    onClick={() => setDiaryData({ ...diaryData, timeOfDay: label })}
                  >
                    {label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 현재 날씨 */}
            <div className="diary-section">
              <h3 className="diary-section-title">현재 날씨는 어떤가요?</h3>
              <div className="chip-row">
                {weatherOptions.map((w) => (
                  <button
                    key={w}
                    className={`chip ${diaryData.weather === w ? 'active' : ''}`}
                    onClick={() => setDiaryData({ ...diaryData, weather: w })}
                  >{w}</button>
                ))}
              </div>
            </div>

            {/* 에피소드 */}
            <div className="diary-section">
              <h3 className="diary-section-title">지금 떠오르는 에피소드</h3>
              <textarea
                className="diary-episode-textarea"
                placeholder="오늘 있었던 일이나 지금 생각나는 것을 자유롭게 적어보세요..."
                value={diaryData.episode}
                onChange={(e) => setDiaryData({ ...diaryData, episode: e.target.value })}
              />
            </div>

            {/* 저장 버튼 */}
            <button
              onClick={handleSave}
              disabled={!diaryData.color || !diaryData.emotion || (diaryData.emotion === '기타' && !customEmotion.trim())}
              className="diary-save-btn"
            >
              저장하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryWriteScreen;
