import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Download, Share2 } from 'lucide-react';

const EmotionPaletteAnalysis = ({ savedEntries, onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('1month');

  // 기간별 데이터 분석
  const analysisData = useMemo(() => {
    if (!savedEntries.length) return null;

    const now = new Date();
    let startDate;

    switch (selectedPeriod) {
      case '1week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filteredEntries = savedEntries.filter(entry =>
      new Date(entry.date) >= startDate
    );

    // 색상별 빈도 및 감정 강도 분석
    const colorAnalysis = {};
    const emotionAnalysis = {};
    const weatherAnalysis = {};

    filteredEntries.forEach(entry => {
      // 색상 분석
      if (entry.color) {
        if (!colorAnalysis[entry.color]) {
          colorAnalysis[entry.color] = {
            count: 0,
            totalIntensity: 0,
            emotions: []
          };
        }
        colorAnalysis[entry.color].count++;
        colorAnalysis[entry.color].totalIntensity += entry.emotionIntensity || 3;
        colorAnalysis[entry.color].emotions.push(entry.emotion);
      }

      // 감정 분석
      if (entry.emotion) {
        if (!emotionAnalysis[entry.emotion]) {
          emotionAnalysis[entry.emotion] = {
            count: 0,
            totalIntensity: 0,
            colors: []
          };
        }
        emotionAnalysis[entry.emotion].count++;
        emotionAnalysis[entry.emotion].totalIntensity += entry.emotionIntensity || 3;
        emotionAnalysis[entry.emotion].colors.push(entry.color);
      }

      // 날씨 분석
      if (entry.weather) {
        if (!weatherAnalysis[entry.weather]) {
          weatherAnalysis[entry.weather] = {
            count: 0,
            emotions: []
          };
        }
        weatherAnalysis[entry.weather].count++;
        weatherAnalysis[entry.weather].emotions.push(entry.emotion);
      }
    });

    // 상위 색상 추출 (빈도 + 강도 가중)
    const topColors = Object.entries(colorAnalysis)
      .map(([color, data]) => ({
        color,
        score: data.count * 0.7 + (data.totalIntensity / data.count) * 0.3,
        count: data.count,
        avgIntensity: data.totalIntensity / data.count,
        dominantEmotion: getMostFrequent(data.emotions)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // 상위 감정 추출
    const topEmotions = Object.entries(emotionAnalysis)
      .map(([emotion, data]) => ({
        emotion,
        count: data.count,
        avgIntensity: data.totalIntensity / data.count,
        dominantColor: getMostFrequent(data.colors)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalEntries: filteredEntries.length,
      topColors,
      topEmotions,
      weatherAnalysis,
      period: selectedPeriod
    };
  }, [savedEntries, selectedPeriod]);

  const getMostFrequent = (arr) => {
    const frequency = {};
    arr.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
    });
    return Object.keys(frequency).reduce((a, b) =>
      frequency[a] > frequency[b] ? a : b
    );
  };

  const generateInsight = () => {
    if (!analysisData) return "아직 충분한 데이터가 없습니다.";

    const { topColors, topEmotions, totalEntries } = analysisData;

    if (totalEntries < 3) {
      return "더 많은 일기를 작성하면 더 정확한 분석을 제공할 수 있습니다.";
    }

    const topColor = topColors[0];
    const topEmotion = topEmotions[0];

    return `지난 ${selectedPeriod === '1week' ? '1주' : selectedPeriod === '1month' ? '1개월' : '3개월'} 동안 ${topEmotion.emotion}을 가장 많이 느끼셨고, ${topColor.color} 색상을 가장 자주 선택하셨습니다. 평균 감정 강도는 ${topEmotion.avgIntensity.toFixed(1)}/5입니다.`;
  };

  const exportData = () => {
    if (!analysisData) return;

    const exportData = {
      period: selectedPeriod,
      totalEntries: analysisData.totalEntries,
      topColors: analysisData.topColors,
      topEmotions: analysisData.topEmotions,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `emotion-analysis-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const shareAnalysis = () => {
    if (!analysisData) return;

    const { topColors, topEmotions } = analysisData;
    const text = `🎨 나의 감정 팔레트 분석 결과\n\n` +
      `📊 기간: ${selectedPeriod === '1week' ? '1주' : selectedPeriod === '1month' ? '1개월' : '3개월'}\n` +
      `🎯 가장 많이 느낀 감정: ${topEmotions[0]?.emotion}\n` +
      `🌈 가장 자주 선택한 색상: ${topColors[0]?.color}\n` +
      `📈 총 기록: ${analysisData.totalEntries}개\n\n` +
      `#감정일기 #컬러팔레트 #MindPalette`;

    if (navigator.share) {
      navigator.share({
        title: '나의 감정 팔레트 분석',
        text: text
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('분석 결과가 클립보드에 복사되었습니다!');
      });
    }
  };

  if (!analysisData) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">감정 팔레트 분석</h1>
          <button
            onClick={onClose}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            돌아가기
          </button>
        </div>
        <div className="text-center py-12">
          <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">아직 분석할 데이터가 없습니다.</p>
          <p className="text-gray-500">일기를 더 작성해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">감정 팔레트 분석</h1>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Download size={16} />
            내보내기
          </button>
          <button
            onClick={shareAnalysis}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Share2 size={16} />
            공유
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            돌아가기
          </button>
        </div>
      </div>

      {/* 기간 선택 */}
      <div className="mb-6">
        <div className="flex gap-2 justify-center">
          {[
            { value: '1week', label: '1주' },
            { value: '1month', label: '1개월' },
            { value: '3months', label: '3개월' }
          ].map(period => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${selectedPeriod === period.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* 인사이트 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp size={24} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI 인사이트</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">{generateInsight()}</p>
      </div>

      {/* 상위 색상 */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🌈 상위 색상 팔레트</h3>
        <div className="grid grid-cols-5 gap-4">
          {analysisData.topColors.map((colorData, index) => (
            <div key={index} className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-200 shadow-md"
                style={{ backgroundColor: colorData.color }}
              />
              <div className="text-sm font-medium text-gray-700">
                {colorData.count}회
              </div>
              <div className="text-xs text-gray-500">
                강도: {colorData.avgIntensity.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">
                주 감정: {colorData.dominantEmotion}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 상위 감정 */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">😊 상위 감정</h3>
        <div className="space-y-3">
          {analysisData.topEmotions.map((emotionData, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{emotionData.emotion}</div>
                  <div className="text-sm text-gray-600">
                    평균 강도: {emotionData.avgIntensity.toFixed(1)}/5
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">{emotionData.count}회</div>
                <div className="text-sm text-gray-600">기록</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 통계 요약</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{analysisData.totalEntries}</div>
            <div className="text-sm text-gray-600">총 기록</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{analysisData.topColors.length}</div>
            <div className="text-sm text-gray-600">사용 색상</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{analysisData.topEmotions.length}</div>
            <div className="text-sm text-gray-600">감정 종류</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {(analysisData.totalEntries / (selectedPeriod === '1week' ? 7 : selectedPeriod === '1month' ? 30 : 90)).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">일평균 기록</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionPaletteAnalysis;
