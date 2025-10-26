/**
 * Mind Palette - Storage Manager
 * 로컬 스토리지 기반 데이터 저장 및 관리
 */

import { EmotionEntry, UserProfile, SessionData, EmotionPattern } from './dataModels.js';

export class StorageManager {
  constructor() {
    this.storageKey = 'mind-palette-data';
    this.userKey = 'mind-palette-user';
    this.sessionsKey = 'mind-palette-sessions';
  }

  // EmotionEntry 저장
  saveEmotionEntry(entry) {
    try {
      entry.validate();
      const entries = this.getAllEntries();
      entries.push(entry.toJSON());
      this.setAllEntries(entries);
      return true;
    } catch (error) {
      console.error('감정 기록 저장 실패:', error);
      return false;
    }
  }

  // 모든 감정 기록 가져오기
  getAllEntries() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      return [];
    }
  }

  // 전체 엔트리 설정
  setAllEntries(entries) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
      return true;
    } catch (error) {
      console.error('데이터 저장 실패:', error);
      return false;
    }
  }

  // 날짜별 엔트리 가져오기
  getEntriesByDate(date) {
    const entries = this.getAllEntries();
    return entries.filter(e => e.date === date);
  }

  // 특정 날짜 범위의 엔트리 가져오기
  getEntriesByDateRange(startDate, endDate) {
    const entries = this.getAllEntries();
    return entries.filter(e => e.date >= startDate && e.date <= endDate);
  }

  // 엔트리 삭제
  deleteEmotionEntry(entryId) {
    const entries = this.getAllEntries();
    const filtered = entries.filter(e => e.id !== entryId);
    return this.setAllEntries(filtered);
  }

  // 엔트리 업데이트
  updateEmotionEntry(entryId, updates) {
    const entries = this.getAllEntries();
    const index = entries.findIndex(e => e.id === entryId);
    
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updates };
      return this.setAllEntries(entries);
    }
    
    return false;
  }

  // 사용자 프로필 저장
  saveUserProfile(profile) {
    try {
      localStorage.setItem(this.userKey, JSON.stringify(profile.toJSON()));
      return true;
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      return false;
    }
  }

  // 사용자 프로필 가져오기
  getUserProfile() {
    try {
      const data = localStorage.getItem(this.userKey);
      return data ? UserProfile.fromJSON(JSON.parse(data)) : null;
    } catch (error) {
      console.error('프로필 로드 실패:', error);
      return null;
    }
  }

  // 세션 데이터 저장
  saveSession(session) {
    try {
      const sessions = this.getAllSessions();
      sessions[session.date] = session.toJSON();
      this.setAllSessions(sessions);
      return true;
    } catch (error) {
      console.error('세션 저장 실패:', error);
      return false;
    }
  }

  // 모든 세션 가져오기
  getAllSessions() {
    try {
      const data = localStorage.getItem(this.sessionsKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('세션 로드 실패:', error);
      return {};
    }
  }

  // 세션 전체 설정
  setAllSessions(sessions) {
    try {
      localStorage.setItem(this.sessionsKey, JSON.stringify(sessions));
      return true;
    } catch (error) {
      console.error('세션 저장 실패:', error);
      return false;
    }
  }

  // 특정 날짜의 세션 가져오기
  getSessionByDate(date) {
    const sessions = this.getAllSessions();
    return sessions[date] ? SessionData.fromJSON(sessions[date]) : null;
  }

  // 감정 패턴 분석
  analyzeEmotionPatterns(startDate, endDate) {
    const entries = this.getEntriesByDateRange(startDate, endDate);
    
    if (entries.length === 0) {
      return null;
    }

    const colorDistribution = {};
    const emotionDistribution = {};
    const timeOfDayPattern = {};
    const weatherPattern = {};

    entries.forEach(entry => {
      // 색상 분포
      colorDistribution[entry.color] = (colorDistribution[entry.color] || 0) + 1;
      
      // 감정 분포
      const emotion = entry.customEmotion || entry.emotion;
      emotionDistribution[emotion] = (emotionDistribution[emotion] || 0) + 1;
      
      // 시간대 패턴
      if (entry.timeOfDay) {
        timeOfDayPattern[entry.timeOfDay] = (timeOfDayPattern[entry.timeOfDay] || 0) + 1;
      }
      
      // 날씨 패턴
      if (entry.weather) {
        weatherPattern[entry.weather] = (weatherPattern[entry.weather] || 0) + 1;
      }
    });

    // 인사이트 생성
    const insights = this.generateInsights({
      colorDistribution,
      emotionDistribution,
      timeOfDayPattern,
      weatherPattern
    });

    return new EmotionPattern({
      dateRange: { start: startDate, end: endDate },
      totalEntries: entries.length,
      colorDistribution,
      emotionDistribution,
      timeOfDayPattern,
      weatherPattern,
      insights
    });
  }

  // AI 인사이트 생성
  generateInsights(patterns) {
    const insights = [];
    
    // 색상 인사이트
    const topColors = Object.entries(patterns.colorDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (topColors.length > 0) {
      insights.push({
        type: 'color',
        message: `가장 많이 사용한 색상: ${topColors.map(c => c[0]).join(', ')}`
      });
    }

    // 감정 인사이트
    const topEmotions = Object.entries(patterns.emotionDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (topEmotions.length > 0) {
      insights.push({
        type: 'emotion',
        message: `자주 느끼는 감정: ${topEmotions.map(e => e[0]).join(', ')}`
      });
    }

    // 시간대 인사이트
    const topTimeSlots = Object.entries(patterns.timeOfDayPattern)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 1);
    
    if (topTimeSlots.length > 0) {
      insights.push({
        type: 'time',
        message: `가장 활발하게 기록하는 시간: ${topTimeSlots[0][0]}`
      });
    }

    return insights;
  }

  // 데이터 내보내기
  exportData() {
    return {
      entries: this.getAllEntries(),
      profile: this.getUserProfile(),
      sessions: this.getAllSessions(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  // 데이터 가져오기
  importData(data) {
    try {
      if (data.entries) {
        this.setAllEntries(data.entries);
      }
      if (data.profile) {
        this.saveUserProfile(UserProfile.fromJSON(data.profile));
      }
      if (data.sessions) {
        this.setAllSessions(data.sessions);
      }
      return true;
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      return false;
    }
  }

  // 모든 데이터 삭제 (주의!)
  clearAllData() {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.userKey);
      localStorage.removeItem(this.sessionsKey);
      return true;
    } catch (error) {
      console.error('데이터 삭제 실패:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스
export const storageManager = new StorageManager();

