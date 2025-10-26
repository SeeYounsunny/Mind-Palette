/**
 * Mind Palette - Data Models
 * AI·데이터 전문가가 정의한 데이터 구조
 */

// 감정 기록 데이터 모델
export class EmotionEntry {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.color = data.color; // HEX 색상 코드
    this.emotion = data.emotion; // 감정 카테고리
    this.intensity = data.intensity || 50; // 감정 강도 (0-100)
    this.episode = data.episode || ''; // 사건/상황 설명
    this.timeOfDay = data.timeOfDay || ''; // 시간대
    this.weather = data.weather || ''; // 날씨
    this.weatherFeeling = data.weatherFeeling || ''; // 날씨에 대한 감정
    this.customEmotion = data.customEmotion || ''; // 사용자 정의 감정
    this.memo = data.memo || ''; // 추가 메모
    this.timestamp = data.timestamp || Date.now();
    this.metadata = data.metadata || {
      platform: 'web',
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  generateId() {
    return `emotion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 데이터 검증
  validate() {
    if (!this.color) throw new Error('색상이 필요합니다');
    if (!this.emotion) throw new Error('감정이 필요합니다');
    return true;
  }

  // JSON 변환
  toJSON() {
    return {
      id: this.id,
      date: this.date,
      color: this.color,
      emotion: this.emotion,
      intensity: this.intensity,
      episode: this.episode,
      timeOfDay: this.timeOfDay,
      weather: this.weather,
      weatherFeeling: this.weatherFeeling,
      customEmotion: this.customEmotion,
      memo: this.memo,
      timestamp: this.timestamp,
      metadata: this.metadata
    };
  }

  // 데이터 복원
  static fromJSON(json) {
    return new EmotionEntry(json);
  }
}

// 사용자 프로필 모델
export class UserProfile {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.username = data.username || '익명';
    this.preferences = data.preferences || {
      theme: 'light',
      colorScheme: 'default',
      notificationEnabled: false,
      language: 'ko'
    };
    this.statistics = data.statistics || {
      totalEntries: 0,
      streak: 0,
      favoriteColors: [],
      dominantEmotions: []
    };
    this.createdAt = data.createdAt || Date.now();
    this.lastActive = data.lastActive || Date.now();
  }

  generateId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      preferences: this.preferences,
      statistics: this.statistics,
      createdAt: this.createdAt,
      lastActive: this.lastActive
    };
  }

  static fromJSON(json) {
    return new UserProfile(json);
  }
}

// 감정 패턴 분석 모델
export class EmotionPattern {
  constructor(data) {
    this.dateRange = data.dateRange || { start: null, end: null };
    this.totalEntries = data.totalEntries || 0;
    this.colorDistribution = data.colorDistribution || {};
    this.emotionDistribution = data.emotionDistribution || {};
    this.timeOfDayPattern = data.timeOfDayPattern || {};
    this.weatherPattern = data.weatherPattern || {};
    this.trending = data.trending || {
      colors: [],
      emotions: [],
      intensity: 0
    };
    this.insights = data.insights || [];
  }

  toJSON() {
    return {
      dateRange: this.dateRange,
      totalEntries: this.totalEntries,
      colorDistribution: this.colorDistribution,
      emotionDistribution: this.emotionDistribution,
      timeOfDayPattern: this.timeOfDayPattern,
      weatherPattern: this.weatherPattern,
      trending: this.trending,
      insights: this.insights
    };
  }
}

// 세션 데이터 모델 (하루의 모든 감정 기록)
export class SessionData {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.entries = data.entries || []; // EmotionEntry 배열
    this.summary = data.summary || {
      dominantColor: null,
      dominantEmotion: null,
      averageIntensity: 0,
      entryCount: 0
    };
    this.mood = data.mood || 'neutral'; // overall mood
    this.timestamp = data.timestamp || Date.now();
  }

  generateId() {
    return `session_${this.date}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 세션 요약 계산
  calculateSummary() {
    if (this.entries.length === 0) return;

    const colorCount = {};
    const emotionCount = {};
    let totalIntensity = 0;

    this.entries.forEach(entry => {
      // 색상 분포
      colorCount[entry.color] = (colorCount[entry.color] || 0) + 1;
      
      // 감정 분포
      const emotion = entry.customEmotion || entry.emotion;
      emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
      
      // 평균 강도
      totalIntensity += entry.intensity;
    });

    // 가장 많이 사용된 색상
    this.summary.dominantColor = Object.keys(colorCount).reduce((a, b) => 
      colorCount[a] > colorCount[b] ? a : b
    );

    // 가장 많이 나타난 감정
    this.summary.dominantEmotion = Object.keys(emotionCount).reduce((a, b) => 
      emotionCount[a] > emotionCount[b] ? a : b
    );

    // 평균 강도
    this.summary.averageIntensity = Math.round(totalIntensity / this.entries.length);
    this.summary.entryCount = this.entries.length;
  }

  toJSON() {
    this.calculateSummary();
    return {
      id: this.id,
      date: this.date,
      entries: this.entries.map(e => e.toJSON()),
      summary: this.summary,
      mood: this.mood,
      timestamp: this.timestamp
    };
  }

  static fromJSON(json) {
    const session = new SessionData(json);
    session.entries = json.entries.map(e => EmotionEntry.fromJSON(e));
    return session;
  }
}

