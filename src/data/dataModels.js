/**
 * 데이터 모델 정의
 * 가령님의 백엔드 데이터 구조와 호환
 */

export class EmotionEntry {
  constructor({ 
    color, 
    emotion, 
    intensity, 
    episode, 
    timeOfDay, 
    weather, 
    weatherFeeling, 
    customEmotion = '',
    memo = ''
  }) {
    this.id = `emotion_${Date.now()}`;
    this.color = color;
    this.emotion = emotion;
    this.intensity = intensity;
    this.episode = episode;
    this.timeOfDay = timeOfDay;
    this.weather = weather;
    this.weatherFeeling = weatherFeeling;
    this.customEmotion = customEmotion;
    this.memo = memo;
    this.date = new Date().toISOString().split('T')[0];
    this.timestamp = new Date().toISOString();
    
    // AI 분석 데이터 구조 (가령님 통합 준비)
    this.aiAnalysis = {
      colorIntensity: intensity,
      emotionCategory: this._categorizeEmotion(emotion),
      sentiment: this._categorizeEmotion(emotion),
      contextKeywords: this._extractKeywords(episode)
    };
  }

  _categorizeEmotion(emotion) {
    const positiveEmotions = ['기쁨', '사랑', '감사', '희망', '설렘', '만족', '행복', '평온'];
    const negativeEmotions = ['슬픔', '분노', '두려움', '혐오', '절망', '외로움', '불안', '우울', '짜증', '후회'];
    
    if (positiveEmotions.includes(emotion)) return 'positive';
    if (negativeEmotions.includes(emotion)) return 'negative';
    return 'neutral';
  }

  _extractKeywords(text) {
    if (!text) return [];
    const commonWords = ['은', '는', '이', '가', '을', '를', '에', '의', '와', '과', '그리고', '하지만', '그런데'];
    return text.split(' ')
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .slice(0, 5);
  }

  toJSON() {
    return {
      id: this.id,
      color: this.color,
      emotion: this.emotion,
      intensity: this.intensity,
      episode: this.episode,
      timeOfDay: this.timeOfDay,
      weather: this.weather,
      weatherFeeling: this.weatherFeeling,
      customEmotion: this.customEmotion,
      memo: this.memo,
      date: this.date,
      timestamp: this.timestamp,
      aiAnalysis: this.aiAnalysis
    };
  }

  static fromJSON(json) {
    const entry = Object.create(EmotionEntry.prototype);
    Object.assign(entry, json);
    return entry;
  }
}
