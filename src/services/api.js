/**
 * Mind Palette API Service
 * 가령님(AI·데이터 전문가)의 백엔드 API와 통신하는 서비스
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * API 호출 헬퍼 함수
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
};

/**
 * 색상 분석 API
 * POST /api/ai/analyze-color
 * 
 * @param {Object} input - 분석할 색상 데이터
 * @param {string} input.color - hex 색상 코드
 * @param {number} input.intensity - 색상 강도 (0-100)
 * @param {string} input.context - 선택적 메모 텍스트
 * @returns {Promise<Object>} AI 추천 감정 목록
 * 
 * @example
 * const result = await analyzeColor({
 *   color: '#4A90E2',
 *   intensity: 75,
 *   context: '오늘 하루'
 * });
 */
export const analyzeColor = async ({ color, intensity, context = '' }) => {
  return await fetchAPI('/ai/analyze-color', {
    method: 'POST',
    body: JSON.stringify({ color, intensity, context }),
  });
};

/**
 * 감정 기록 저장 API
 * POST /api/emotions
 * 
 * @param {Object} emotionData - 저장할 감정 데이터
 * @returns {Promise<Object>} 저장된 감정 기록
 * 
 * @example
 * const saved = await saveEmotion({
 *   color: '#4A90E2',
 *   intensity: 75,
 *   emotion: '평온',
 *   note: '오늘 기분 좋음',
 *   timestamp: '2025-01-26T10:30:00Z'
 * });
 */
export const saveEmotion = async (emotionData) => {
  return await fetchAPI('/emotions', {
    method: 'POST',
    body: JSON.stringify(emotionData),
  });
};

/**
 * 감정 기록 조회 API
 * GET /api/emotions
 * 
 * @param {Object} filters - 조회 필터
 * @param {string} filters.startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} filters.endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns {Promise<Object>} 감정 기록 목록
 * 
 * @example
 * const records = await getEmotions({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 */
export const getEmotions = async ({ startDate, endDate }) => {
  const params = new URLSearchParams({ startDate, endDate });
  return await fetchAPI(`/emotions?${params.toString()}`);
};

/**
 * 특정 감정 기록 조회 API
 * GET /api/emotions/:id
 * 
 * @param {string} id - 기록 ID
 * @returns {Promise<Object>} 감정 기록
 * 
 * @example
 * const record = await getEmotionById('emotion_123');
 */
export const getEmotionById = async (id) => {
  return await fetchAPI(`/emotions/${id}`);
};

/**
 * 감정 기록 수정 API
 * PUT /api/emotions/:id
 * 
 * @param {string} id - 기록 ID
 * @param {Object} updateData - 수정할 데이터
 * @returns {Promise<Object>} 수정된 감정 기록
 * 
 * @example
 * const updated = await updateEmotion('emotion_123', {
 *   note: '수정된 메모'
 * });
 */
export const updateEmotion = async (id, updateData) => {
  return await fetchAPI(`/emotions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

/**
 * 감정 기록 삭제 API
 * DELETE /api/emotions/:id
 * 
 * @param {string} id - 기록 ID
 * @returns {Promise<Object>} 삭제 결과
 * 
 * @example
 * const result = await deleteEmotion('emotion_123');
 */
export const deleteEmotion = async (id) => {
  return await fetchAPI(`/emotions/${id}`, {
    method: 'DELETE',
  });
};

/**
 * 감정 트렌드 분석 API
 * POST /api/ai/analyze-trends
 * 
 * @param {Object} input - 분석할 데이터
 * @param {Array} input.records - 감정 기록 배열
 * @param {Object} input.dateRange - 분석 기간
 * @returns {Promise<Object>} 트렌드 분석 결과
 * 
 * @example
 * const trends = await analyzeTrends({
 *   records: emotionRecords,
 *   dateRange: { start: new Date('2025-01-01'), end: new Date('2025-01-31') }
 * });
 */
export const analyzeTrends = async ({ records, dateRange }) => {
  return await fetchAPI('/ai/analyze-trends', {
    method: 'POST',
    body: JSON.stringify({ records, dateRange }),
  });
};

/**
 * API 기본 설정
 */
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초
  retryAttempts: 3, // 재시도 횟수
};

/**
 * 오프라인 모드 체크 및 로컬 저장소 활용
 * API가 실패하면 LocalStorage에 임시 저장 후, 나중에 동기화
 */
export const saveEmotionWithFallback = async (emotionData) => {
  try {
    // API 호출 시도
    return await saveEmotion(emotionData);
  } catch (error) {
    // API 실패 시 LocalStorage에 저장 (나중에 동기화)
    const pendingSave = {
      ...emotionData,
      id: Date.now().toString(),
      pendingSync: true,
      timestamp: new Date().toISOString(),
    };
    
    const existing = JSON.parse(localStorage.getItem('pendingEmotionSync') || '[]');
    existing.push(pendingSave);
    localStorage.setItem('pendingEmotionSync', JSON.stringify(existing));
    
    console.warn('API failed, saved to LocalStorage for later sync:', pendingSave);
    
    // LocalStorage 데이터로 대체 반환
    return pendingSave;
  }
};

/**
 * 대기 중인 동기화 처리
 * API가 복구되면 LocalStorage의 pending 데이터를 동기화
 */
export const syncPendingEmotions = async () => {
  const pending = JSON.parse(localStorage.getItem('pendingEmotionSync') || '[]');
  
  if (pending.length === 0) return;
  
  const synced = [];
  const failed = [];
  
  for (const emotionData of pending) {
    try {
      await saveEmotion(emotionData);
      synced.push(emotionData);
    } catch (error) {
      failed.push(emotionData);
    }
  }
  
  // 성공한 것들 제거, 실패한 것들은 다시 저장
  localStorage.setItem('pendingEmotionSync', JSON.stringify(failed));
  
  return { synced, failed };
};


