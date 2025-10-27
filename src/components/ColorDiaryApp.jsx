import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Calendar, Save, Eye, BarChart3, Share2 } from 'lucide-react';
import EmotionPaletteAnalysis from './EmotionPaletteAnalysis';
import ShareImageGenerator from './ShareImageGenerator';

const ColorDiaryApp = () => {
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [customEmotion, setCustomEmotion] = useState('');
  const [customWeatherFeeling, setCustomWeatherFeeling] = useState('');
  const [selectedDateEntries, setSelectedDateEntries] = useState(null);

  // 33개 컬러 팔레트 (11개씩 3줄)
  const colors = [
    // 첫 번째 줄 (연한 색상)
    '#FDD6D6', '#FFDAC7', '#F9F2A2', '#E0F5BA', '#B7EDB9',
    '#BBEAE2', '#B9EAF2', '#BCDFFF', '#D5CAF5', '#FFCBE9', '#FFFFFF',
    // 두 번째 줄 (중간 색상)
    '#D32929', '#F46B06', '#FFD700', '#91C249', '#33A24F',
    '#4EA9B1', '#3A85B8', '#2356A7', '#7445A3', '#B93984', '#B2B2B2',
    // 세 번째 줄 (진한 색상)
    '#7A0724', '#864F3A', '#84753C', '#5B8643', '#206340',
    '#256872', '#154D6F', '#0D295D', '#39155F', '#4F1040', '#000000'
  ];

  // 감정 리스트
  const emotions = [
    '기쁨', '슬픔', '분노', '두려움', '놀람', '혐오', '사랑',
    '감사', '희망', '절망', '외로움', '평온', '불안', '행복',
    '우울', '짜증', '설렘', '후회', '부러움', '만족', '기타'
  ];

  // 시간대
  const timeOptions = [
    '새벽 (04:00-06:00)', '아침 (06:00-09:00)', '오전 (09:00-12:00)',
    '점심 (12:00-14:00)', '오후 (14:00-17:00)', '저녁 (17:00-20:00)',
    '밤 (20:00-24:00)', '심야 (24:00-04:00)'
  ];

  // 날씨 옵션
  const weatherOptions = [
    '맑음 ☀️', '흐림 ☁️', '비 🌧️', '눈 ❄️', '바람 💨',
    '안개 🌫️', '천둥번개 ⛈️', '무더위 🥵', '추위 🥶'
  ];

  // 날씨에 따른 느낌 (확장)
  const weatherFeelings = {
    '맑음 ☀️': ['상쾌함', '활기찬', '밝음', '따뜻함', '기분좋음', '에너지충만', '기타'],
    '흐림 ☁️': ['차분함', '우울함', '편안함', '답답함', '몽환적', '평온함', '기타'],
    '비 🌧️': ['차분함', '우울함', '로맨틱함', '시원함', '쓸쓸함', '깨끗함', '기타'],
    '눈 ❄️': ['설렘', '추위', '평온함', '동화같음', '신비로움', '순수함', '기타'],
    '바람 💨': ['시원함', '상쾌함', '불안함', '자유로움', '역동적', '시원함', '기타'],
    '안개 🌫️': ['몽환적', '신비로움', '답답함', '차분함', '미스터리', '조용함', '기타'],
    '천둥번개 ⛈️': ['두려움', '스릴', '웅장함', '불안함', '강렬함', '긴장감', '기타'],
    '무더위 🥵': ['짜증', '지침', '나른함', '불쾌함', '답답함', '힘듦', '기타'],
    '추위 🥶': ['움츠러듦', '따뜻함그리움', '상쾌함', '우울함', '깔끔함', '고독함', '기타']
  };

  const handleNext = () => {
    if (currentPage < 7) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = savedEntries.filter(entry => entry.date === today);

    if (todayEntries.length >= 4) {
      alert('하루에 최대 4개의 일기만 작성할 수 있습니다.');
      return;
    }

    const finalEmotion = diaryData.emotion === '기타' ? customEmotion : diaryData.emotion;
    const finalWeatherFeeling = diaryData.weatherFeeling === '기타' ? customWeatherFeeling : diaryData.weatherFeeling;

    const newEntry = {
      ...diaryData,
      emotion: finalEmotion,
      weatherFeeling: finalWeatherFeeling,
      date: today,
      timestamp: new Date().toLocaleString(),
      id: Date.now() // 각 일기에 고유 ID 부여
    };

    const updatedEntries = [...savedEntries, newEntry];
    setSavedEntries(updatedEntries);

    alert(`오늘의 ${todayEntries.length + 1}번째 일기가 저장되었습니다!`);
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
  };

  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // 빈 칸 추가
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEntries = savedEntries.filter(entry => entry.date === dateString);
      days.push({ day, dateString, entries: dayEntries });
    }

    return days;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">지금 가장 끌리는 컬러를 선택해주세요</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-11 gap-3">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-full border transition-all duration-200 ${diaryData.color === color
                        ? 'border-gray-800 border-3 scale-110'
                        : color === '#FFFFFF'
                          ? 'border-gray-300 border-2 hover:border-gray-400'
                          : 'border-gray-200 border-2 hover:border-gray-400'
                      }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setDiaryData({ ...diaryData, color })}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">오늘 회피하고 싶은 컬러는?</h2>
            <p className="text-gray-600 mb-4">선택사항입니다. 피하고 싶은 색이 있다면 선택해주세요.</p>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-11 gap-3">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-full border transition-all duration-200 ${diaryData.avoidColor === color
                        ? 'border-red-500 border-3 scale-110'
                        : color === '#FFFFFF'
                          ? 'border-gray-300 border-2 hover:border-gray-400'
                          : 'border-gray-200 border-2 hover:border-gray-400'
                      }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setDiaryData({ ...diaryData, avoidColor: color })}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setDiaryData({ ...diaryData, avoidColor: '' })}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                회피 컬러 없음
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">지금 느끼는 감정은?</h2>
            <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto mb-4">
              {emotions.map((emotion, index) => (
                <button
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${diaryData.emotion === emotion
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
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
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="감정을 직접 입력해주세요"
                  value={customEmotion}
                  onChange={(e) => setCustomEmotion(e.target.value)}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none text-center"
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">감정의 강도는 어느 정도인가요?</h2>
            <p className="text-gray-600 mb-6">선택한 감정: <span className="font-semibold text-blue-600">{diaryData.emotion === '기타' ? customEmotion : diaryData.emotion}</span></p>

            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>매우 약함</span>
                  <span>매우 강함</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={diaryData.emotionIntensity}
                  onChange={(e) => setDiaryData({ ...diaryData, emotionIntensity: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(diaryData.emotionIntensity - 1) * 25}%, #3b82f6 ${(diaryData.emotionIntensity - 1) * 25}%, #3b82f6 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-lg font-semibold text-blue-700 mb-2">
                  강도: {diaryData.emotionIntensity}/5
                </div>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full mx-1 ${index < diaryData.emotionIntensity ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">지금 떠오르는 에피소드</h2>
            <textarea
              className="w-full max-w-md mx-auto h-40 p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
              placeholder="오늘 있었던 일이나 지금 생각나는 것을 자유롭게 적어보세요..."
              value={diaryData.episode}
              onChange={(e) => setDiaryData({ ...diaryData, episode: e.target.value })}
            />
          </div>
        );

      case 6:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">지금은 언제인가요?</h2>
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
              {timeOptions.map((time, index) => (
                <button
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${diaryData.timeOfDay === time
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  onClick={() => setDiaryData({ ...diaryData, timeOfDay: time })}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">현재 날씨는?</h2>
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {weatherOptions.map((weather, index) => (
                <button
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-lg ${diaryData.weather === weather
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  onClick={() => setDiaryData({ ...diaryData, weather })}
                >
                  {weather}
                </button>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">이 날씨에 대한 느낌은?</h2>
            <p className="text-gray-600 mb-4">선택한 날씨: {diaryData.weather}</p>
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-4">
              {diaryData.weather && weatherFeelings[diaryData.weather] &&
                weatherFeelings[diaryData.weather].map((feeling, index) => (
                  <button
                    key={index}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${diaryData.weatherFeeling === feeling
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    onClick={() => {
                      setDiaryData({ ...diaryData, weatherFeeling: feeling });
                      if (feeling !== '기타') setCustomWeatherFeeling('');
                    }}
                  >
                    {feeling}
                  </button>
                ))
              }
            </div>
            {diaryData.weatherFeeling === '기타' && (
              <div className="max-w-md mx-auto mb-4">
                <input
                  type="text"
                  placeholder="날씨에 대한 느낌을 직접 입력해주세요"
                  value={customWeatherFeeling}
                  onChange={(e) => setCustomWeatherFeeling(e.target.value)}
                  className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none text-center"
                />
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={
                !diaryData.weatherFeeling ||
                (diaryData.weatherFeeling === '기타' && !customWeatherFeeling.trim())
              }
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              <Save size={20} />
              일기 저장하기
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (showShare) {
    return (
      <ShareImageGenerator
        savedEntries={savedEntries}
        onClose={() => setShowShare(false)}
      />
    );
  }

  if (showAnalysis) {
    return (
      <EmotionPaletteAnalysis
        savedEntries={savedEntries}
        onClose={() => setShowAnalysis(false)}
      />
    );
  }

  if (showCalendar) {
    const calendarDays = generateCalendar();
    const today = new Date();
    const monthName = today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">컬러 일기 캘린더</h1>
          <button
            onClick={() => {
              setShowCalendar(false);
              setSelectedDateEntries(null);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            돌아가기
          </button>
        </div>

        {selectedDateEntries ? (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{selectedDateEntries.date}</h3>
              <span className="text-sm text-gray-600">{selectedDateEntries.entries.length}개의 일기</span>
            </div>

            <div className="space-y-6">
              {selectedDateEntries.entries.map((entry, index) => (
                <div key={entry.id} className="bg-white rounded-lg p-4 border-l-4" style={{ borderLeftColor: entry.color }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="font-semibold text-gray-700">일기 {index + 1}</span>
                    <span className="text-xs text-gray-500">{entry.timestamp}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>감정:</strong> {entry.emotion} (강도: {entry.emotionIntensity}/5)</p>
                    <p><strong>시간:</strong> {entry.timeOfDay}</p>
                    <p><strong>날씨:</strong> {entry.weather} → {entry.weatherFeeling}</p>
                    {entry.avoidColor && (
                      <p><strong>회피 컬러:</strong>
                        <span
                          className="inline-block w-4 h-4 rounded-full ml-2 border border-gray-300"
                          style={{ backgroundColor: entry.avoidColor }}
                        />
                      </p>
                    )}
                    <div>
                      <strong>에피소드:</strong>
                      <p className="mt-1 p-2 bg-gray-50 rounded text-xs">{entry.episode}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedDateEntries(null)}
              className="mt-6 text-blue-500 hover:text-blue-700"
            >
              ← 캘린더로 돌아가기
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">{monthName}</h2>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                <div key={day} className="text-center font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayData, index) => (
                <div
                  key={index}
                  className="aspect-square flex items-center justify-center relative"
                >
                  {dayData && (
                    <button
                      onClick={() => dayData.entries.length > 0 && setSelectedDateEntries({
                        date: dayData.dateString,
                        entries: dayData.entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      })}
                      className={`w-full h-full rounded-lg flex flex-col items-center justify-center text-xs font-medium relative overflow-hidden ${dayData.entries.length > 0
                          ? 'cursor-pointer hover:opacity-80 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      style={{
                        background: dayData.entries.length > 0
                          ? dayData.entries.length === 1
                            ? dayData.entries[0].color
                            : `conic-gradient(${dayData.entries.slice().reverse().map((entry, i) =>
                              `${entry.color} ${(i / dayData.entries.length) * 360}deg ${((i + 1) / dayData.entries.length) * 360}deg`
                            ).join(', ')})`
                          : 'transparent'
                      }}
                    >
                      <span className={`${dayData.entries.length > 1 ? 'bg-black bg-opacity-50 px-1 rounded' : ''}`}>
                        {dayData.day}
                      </span>
                      {dayData.entries.length > 1 && (
                        <span className="text-xs bg-black bg-opacity-50 px-1 rounded mt-1">
                          {dayData.entries.length}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              색칠된 날짜를 클릭하면 일기 내용을 볼 수 있습니다<br />
              <span className="text-xs">여러 개의 일기가 있는 날은 모든 색깔이 표시됩니다</span>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 min-h-96">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">컬러 일기</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCalendar(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Eye size={16} />
            일기 보기
          </button>
          <button
            onClick={() => setShowAnalysis(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <BarChart3 size={16} />
            감정 분석
          </button>
          <button
            onClick={() => setShowShare(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <Share2 size={16} />
            공유하기
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <div className="text-sm text-gray-600">
            {currentPage} / 8
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentPage / 8) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        {renderPage()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          이전
        </button>

        {currentPage < 8 && (
          <button
            onClick={handleNext}
            disabled={
              (currentPage === 1 && !diaryData.color) ||
              (currentPage === 3 && (!diaryData.emotion || (diaryData.emotion === '기타' && !customEmotion.trim()))) ||
              (currentPage === 5 && !diaryData.episode.trim()) ||
              (currentPage === 6 && !diaryData.timeOfDay) ||
              (currentPage === 7 && !diaryData.weather)
            }
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            다음
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ColorDiaryApp;

