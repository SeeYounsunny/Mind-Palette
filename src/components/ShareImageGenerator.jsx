import React, { useRef, useState } from 'react';
import { Download, Share2, Image as ImageIcon, X } from 'lucide-react';

const ShareImageGenerator = ({ savedEntries, onClose }) => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const generateImage = async () => {
    setIsGenerating(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // 캔버스 크기 설정 (1080x1080)
      canvas.width = 1080;
      canvas.height = 1080;

      // 배경 그라데이션
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // 제목
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('나의 감정 팔레트', 540, 120);

      // 부제목
      ctx.font = '24px Arial';
      ctx.fillText('Mind Palette', 540, 160);

      // 현재 월 표시
      const now = new Date();
      const monthName = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
      ctx.font = '32px Arial';
      ctx.fillText(`${monthName}의 감정 기록`, 540, 220);

      // 색상 팔레트 생성
      const colorAnalysis = {};
      savedEntries.forEach(entry => {
        if (entry.color) {
          colorAnalysis[entry.color] = (colorAnalysis[entry.color] || 0) + 1;
        }
      });

      const topColors = Object.entries(colorAnalysis)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([color]) => color);

      // 팔레트 그리기
      const paletteSize = 80;
      const paletteSpacing = 100;
      const startX = 540 - (topColors.length * paletteSpacing) / 2;

      topColors.forEach((color, index) => {
        const x = startX + index * paletteSpacing;
        const y = 350;

        // 색상 원
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, paletteSize / 2, 0, 2 * Math.PI);
        ctx.fill();

        // 테두리
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.stroke();

        // 사용 횟수
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(colorAnalysis[color].toString(), x, y + 120);
      });

      // 통계 정보
      ctx.font = '28px Arial';
      ctx.fillText(`총 ${savedEntries.length}개의 감정 기록`, 540, 600);

      // 감정 분석
      const emotionAnalysis = {};
      savedEntries.forEach(entry => {
        if (entry.emotion) {
          emotionAnalysis[entry.emotion] = (emotionAnalysis[entry.emotion] || 0) + 1;
        }
      });

      const topEmotion = Object.entries(emotionAnalysis)
        .sort(([, a], [, b]) => b - a)[0];

      if (topEmotion) {
        ctx.font = '24px Arial';
        ctx.fillText(`가장 많이 느낀 감정: ${topEmotion[0]}`, 540, 650);
      }

      // 하단 브랜딩
      ctx.font = '20px Arial';
      ctx.fillText('Made with Mind Palette', 540, 1000);

      // 이미지 데이터 URL 생성
      const imageDataUrl = canvas.toDataURL('image/png');
      setGeneratedImage(imageDataUrl);

    } catch (error) {
      console.error('이미지 생성 중 오류:', error);
      alert('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `mind-palette-${new Date().toISOString().split('T')[0]}.png`;
    link.click();
  };

  const shareImage = async () => {
    if (!generatedImage) return;

    try {
      // 이미지를 Blob으로 변환
      const response = await fetch(generatedImage);
      const blob = await response.blob();

      if (navigator.share && navigator.canShare({ files: [new File([blob], 'mind-palette.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: '나의 감정 팔레트',
          text: 'Mind Palette로 만든 나의 감정 팔레트를 확인해보세요!',
          files: [new File([blob], 'mind-palette.png', { type: 'image/png' })]
        });
      } else {
        // 클립보드에 복사
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        alert('이미지가 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      console.error('공유 중 오류:', error);
      alert('공유 중 오류가 발생했습니다.');
    }
  };

  const exportCSV = () => {
    if (!savedEntries.length) return;

    const headers = ['날짜', '시간', '색상', '회피색상', '감정', '감정강도', '에피소드', '시간대', '날씨', '날씨느낌'];
    const csvContent = [
      headers.join(','),
      ...savedEntries.map(entry => [
        entry.date,
        entry.timestamp,
        entry.color,
        entry.avoidColor || '',
        entry.emotion,
        entry.emotionIntensity || 3,
        `"${(entry.episode || '').replace(/"/g, '""')}"`,
        entry.timeOfDay,
        entry.weather,
        entry.weatherFeeling
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mind-palette-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">공유 이미지 생성</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      {!generatedImage ? (
        <div className="text-center py-12">
          <ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-4">감정 팔레트 이미지 생성</h3>
          <p className="text-gray-600 mb-6">
            당신의 감정 기록을 아름다운 이미지로 만들어보세요.<br />
            소셜미디어에 공유하거나 개인적으로 보관할 수 있습니다.
          </p>

          <div className="space-y-4">
            <button
              onClick={generateImage}
              disabled={isGenerating || !savedEntries.length}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
            >
              <ImageIcon size={20} />
              {isGenerating ? '생성 중...' : '이미지 생성하기'}
            </button>

            {!savedEntries.length && (
              <p className="text-sm text-gray-500">먼저 일기를 작성해주세요.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 생성된 이미지 미리보기 */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">생성된 이미지</h3>
            <div className="inline-block border-2 border-gray-200 rounded-lg overflow-hidden">
              <img
                src={generatedImage}
                alt="Generated emotion palette"
                className="max-w-full h-auto"
                style={{ maxWidth: '400px' }}
              />
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex justify-center gap-4">
            <button
              onClick={downloadImage}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Download size={16} />
              다운로드
            </button>

            <button
              onClick={shareImage}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Share2 size={16} />
              공유
            </button>

            <button
              onClick={() => setGeneratedImage(null)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              다시 생성
            </button>
          </div>
        </div>
      )}

      {/* 숨겨진 캔버스 */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />

      {/* 데이터 내보내기 섹션 */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">데이터 내보내기</h3>
        <p className="text-gray-600 mb-4">
          모든 감정 기록을 CSV 파일로 내보내서 다른 도구에서 사용하거나 백업할 수 있습니다.
        </p>

        <button
          onClick={exportCSV}
          disabled={!savedEntries.length}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          CSV 내보내기
        </button>

        {savedEntries.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            총 {savedEntries.length}개의 기록을 내보냅니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShareImageGenerator;
