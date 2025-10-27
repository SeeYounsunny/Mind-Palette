/**
 * Storage Manager
 * LocalStorage와 백엔드 API를 통합 관리
 */

import { EmotionEntry } from './dataModels.js';
import * as api from '../services/api.js';

const STORAGE_KEY = 'mind-palette-data';
const USE_API = false; // API 사용 여부 (가령님 백엔드 준비되면 true)

export const storageManager = {
  /**
   * 감정 기록을 저장
   * @param {EmotionEntry} entry 
   * @returns {boolean} 저장 성공 여부
   */
  saveEmotionEntry(entry) {
    try {
      // API 사용 시 백엔드에 저장
      if (USE_API) {
        return this._saveToAPI(entry);
      }
      
      // 로컬 저장
      return this._saveToLocalStorage(entry);
    } catch (error) {
      console.error('감정 기록 저장 실패:', error);
      return false;
    }
  },

  /**
   * LocalStorage에 저장
   */
  _saveToLocalStorage(entry) {
    try {
      const existing = this.getAllEntries();
      existing.push(entry.toJSON());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      console.log('LocalStorage에 저장됨:', entry);
      return true;
    } catch (error) {
      console.error('LocalStorage 저장 실패:', error);
      return false;
    }
  },

  /**
   * API에 저장 (가령님 백엔드)
   */
  async _saveToAPI(entry) {
    try {
      // 먼저 API에 저장 시도
      await api.saveEmotionWithFallback(entry.toJSON());
      
      // 성공하면 로컬에도 백업
      this._saveToLocalStorage(entry);
      return true;
    } catch (error) {
      console.error('API 저장 실패:', error);
      // API 실패해도 로컬에는 저장
      return this._saveToLocalStorage(entry);
    }
  },

  /**
   * 모든 기록 조회
   * @returns {Array} EmotionEntry 배열
   */
  getAllEntries() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map(EmotionEntry.fromJSON);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      return [];
    }
  },

  /**
   * 특정 날짜의 기록 조회
   * @param {string} date - YYYY-MM-DD 형식
   * @returns {Array} 해당 날짜의 기록
   */
  getEntriesByDate(date) {
    const all = this.getAllEntries();
    return all.filter(entry => entry.date === date);
  },

  /**
   * 특정 ID의 기록 조회
   * @param {string} id 
   * @returns {EmotionEntry|null}
   */
  getEntryById(id) {
    const all = this.getAllEntries();
    return all.find(entry => entry.id === id) || null;
  },

  /**
   * 기록 삭제
   * @param {string} id 
   * @returns {boolean}
   */
  deleteEntry(id) {
    try {
      const all = this.getAllEntries();
      const filtered = all.filter(entry => entry.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.map(e => e.toJSON())));
      return true;
    } catch (error) {
      console.error('삭제 실패:', error);
      return false;
    }
  },

  /**
   * 모든 데이터 삭제
   */
  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('모든 데이터 삭제됨');
      return true;
    } catch (error) {
      console.error('데이터 삭제 실패:', error);
      return false;
    }
  },

  /**
   * 데이터 통계
   * @returns {Object}
   */
  getStatistics() {
    const all = this.getAllEntries();
    const today = new Date().toISOString().split('T')[0];
    
    return {
      totalEntries: all.length,
      todayEntries: all.filter(e => e.date === today).length,
      emotionDistribution: this._getEmotionDistribution(all),
      colorDistribution: this._getColorDistribution(all)
    };
  },

  _getEmotionDistribution(entries) {
    const distribution = {};
    entries.forEach(entry => {
      distribution[entry.emotion] = (distribution[entry.emotion] || 0) + 1;
    });
    return distribution;
  },

  _getColorDistribution(entries) {
    const distribution = {};
    entries.forEach(entry => {
      distribution[entry.color] = (distribution[entry.color] || 0) + 1;
    });
    return distribution;
  }
};
