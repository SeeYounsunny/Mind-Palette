import { test, expect } from '@playwright/test';

test.describe('Mind Palette - 컬러 일기 앱', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 LocalStorage 초기화
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('앱이 정상적으로 로드되고 기본 화면이 표시되는지 확인', async ({ page }) => {
    await page.goto('/');
    
    // 타이틀 확인
    await expect(page.getByRole('heading', { name: '컬러 일기' })).toBeVisible();
    
    // 주요 버튼들 확인
    await expect(page.getByRole('button', { name: '일기 보기' })).toBeVisible();
    await expect(page.getByRole('button', { name: '감정 분석' })).toBeVisible();
    await expect(page.getByRole('button', { name: '공유하기' })).toBeVisible();
    
    // 첫 번째 페이지 제목 확인
    await expect(page.getByRole('heading', { name: '지금 가장 끌리는 컬러를 선택해주세요' })).toBeVisible();
  });

  test('컬러 선택 기능 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 컬러 팔레트 확인
    const colorButtons = page.locator('button').filter({ hasNotText: '다음' }).filter({ hasNotText: '이전' });
    await expect(colorButtons.first()).toBeVisible();
    
    // 첫 번째 컬러 선택
    const firstColorButton = page.locator('button[style*="background-color"]').first();
    await firstColorButton.click();
    
    // 다음 버튼 활성화 확인
    const nextButton = page.getByRole('button', { name: '다음' });
    await expect(nextButton).toBeEnabled();
  });

  test('감정 선택 및 강도 조절 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 컬러 선택
    const firstColorButton = page.locator('button[style*="background-color"]').first();
    await firstColorButton.click();
    await page.getByRole('button', { name: '다음' }).click();
    
    // 회피 컬러 없음 선택 (건너뛰기)
    await page.getByRole('button', { name: '다음' }).click();
    
    // 감정 선택 페이지 확인
    await expect(page.getByRole('heading', { name: '지금 느끼는 감정은?' })).toBeVisible();
    
    // 감정 선택 (기쁨)
    await page.getByRole('button', { name: '기쁨' }).click();
    
    // 다음 버튼 클릭
    await page.getByRole('button', { name: '다음' }).click();
    
    // 감정 강도 페이지 확인
    await expect(page.getByRole('heading', { name: '감정의 강도는 어느 정도인가요?' })).toBeVisible();
    
    // 슬라이더로 강도 조절
    const slider = page.locator('input[type="range"]');
    await slider.fill('4');
    
    // 강도 표시 확인
    await expect(page.getByText('강도: 4/5')).toBeVisible();
  });

  test('에피소드 작성 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 컬러 선택
    await page.locator('button[style*="background-color"]').first().click();
    await page.getByRole('button', { name: '다음' }).click();
    
    // 회피 컬러 건너뛰기
    await page.getByRole('button', { name: '다음' }).click();
    
    // 감정 선택
    await page.getByRole('button', { name: '기쁨' }).click();
    await page.getByRole('button', { name: '다음' }).click();
    
    // 강도 설정
    await page.locator('input[type="range"]').fill('3');
    await page.getByRole('button', { name: '다음' }).click();
    
    // 에피소드 페이지 확인
    await expect(page.getByRole('heading', { name: '지금 떠오르는 에피소드' })).toBeVisible();
    
    // 에피소드 작성
    const textarea = page.locator('textarea');
    await textarea.fill('오늘은 정말 좋은 하루였어요!');
    
    // 다음 버튼 클릭
    await page.getByRole('button', { name: '다음' }).click();
  });

  test('날씨 선택 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 이전 단계들 완료
    await page.locator('button[style*="background-color"]').first().click();
    await page.getByRole('button', { name: '다음' }).click();
    await page.getByRole('button', { name: '다음' }).click();
    await page.getByRole('button', { name: '기쁨' }).click();
    await page.getByRole('button', { name: '다음' }).click();
    await page.locator('input[type="range"]').fill('3');
    await page.getByRole('button', { name: '다음' }).click();
    await page.locator('textarea').fill('좋은 하루');
    await page.getByRole('button', { name: '다음' }).click();
    
    // 시간대 선택
    await expect(page.getByRole('heading', { name: '지금은 언제인가요?' })).toBeVisible();
    await page.getByRole('button', { name: /오전/ }).click();
    
    // 날씨 선택 페이지 확인
    await expect(page.getByRole('heading', { name: '현재 날씨는?' })).toBeVisible();
    
    // 날씨 선택
    await page.getByRole('button', { name: /맑음/ }).click();
  });

  test('일기 저장 완료 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 전체 플로우 진행
    // 1. 컬러 선택
    await page.locator('button[style*="background-color"]').first().click();
    await page.getByRole('button', { name: '다음' }).click();
    
    // 2. 회피 컬러 건너뛰기
    await page.getByRole('button', { name: '다음' }).click();
    
    // 3. 감정 선택
    await page.getByRole('button', { name: '기쁨' }).click();
    await page.getByRole('button', { name: '다음' }).click();
    
    // 4. 강도 설정
    await page.locator('input[type="range"]').fill('4');
    await page.getByRole('button', { name: '다음' }).click();
    
    // 5. 에피소드 작성
    await page.locator('textarea').fill('테스트 에피소드입니다.');
    await page.getByRole('button', { name: '다음' }).click();
    
    // 6. 시간대 선택
    await page.getByRole('button', { name: /오전/ }).click();
    
    // 7. 날씨 선택
    await page.getByRole('button', { name: /맑음/ }).click();
    
    // 8. 날씨 느낌 선택
    await expect(page.getByRole('heading', { name: '이 날씨에 대한 느낌은?' })).toBeVisible();
    await page.getByRole('button', { name: '상쾌함' }).click();
    
    // 9. 저장 버튼 클릭
    const saveButton = page.getByRole('button', { name: '일기 저장하기' });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    
    // 10. 저장 확인 알림 대기 (alert 대기)
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('저장되었습니다');
      await dialog.accept();
    });
    
    // 페이지가 첫 페이지로 돌아가는지 확인
    await expect(page.getByRole('heading', { name: '지금 가장 끌리는 컬러를 선택해주세요' })).toBeVisible();
  });

  test('캘린더 뷰 확인 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 일기 보기 버튼 클릭
    await page.getByRole('button', { name: '일기 보기' }).click();
    
    // 캘린더 제목 확인
    await expect(page.getByRole('heading', { name: '컬러 일기 캘린더' })).toBeVisible();
    
    // 돌아가기 버튼 확인
    await expect(page.getByRole('button', { name: '돌아가기' })).toBeVisible();
    
    // 돌아가기 버튼 클릭
    await page.getByRole('button', { name: '돌아가기' }).click();
    
    // 매인 화면으로 돌아왔는지 확인
    await expect(page.getByRole('heading', { name: '컬러 일기' })).toBeVisible();
  });

  test('감정 분석 기능 확인 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 감정 분석 버튼 클릭
    await page.getByRole('button', { name: '감정 분석' }).click();
    
    // 분석 화면 확인
    await expect(page.getByRole('heading', { name: '감정 팔레트 분석' })).toBeVisible();
    
    // 데이터가 없을 때 메시지 확인
    await expect(page.getByText('아직 분석할 데이터가 없습니다')).toBeVisible();
    
    // 돌아가기 버튼 클릭
    await page.getByRole('button', { name: '돌아가기' }).click();
  });

  test('공유 이미지 생성 기능 확인 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 공유하기 버튼 클릭
    await page.getByRole('button', { name: '공유하기' }).click();
    
    // 공유 이미지 생성 화면 확인
    await expect(page.getByRole('heading', { name: '공유 이미지 생성' })).toBeVisible();
    
    // 데이터가 없을 때 메시지 확인
    await expect(page.getByText('먼저 일기를 작성해주세요')).toBeVisible();
    
    // 닫기 버튼 클릭
    const closeButton = page.locator('button').filter({ hasText: /close/i }).or(page.locator('svg')).first();
    await page.keyboard.press('Escape'); // ESC 키로 닫기
  });

  test('회피 컬러 선택 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 컬러 선택
    await page.locator('button[style*="background-color"]').first().click();
    await page.getByRole('button', { name: '다음' }).click();
    
    // 회피 컬러 페이지 확인
    await expect(page.getByRole('heading', { name: '오늘 회피하고 싶은 컬러는?' })).toBeVisible();
    
    // 회피 컬러 선택
    const secondColorButton = page.locator('button[style*="background-color"]').nth(5);
    await secondColorButton.click();
    
    // 다음 버튼 클릭
    await page.getByRole('button', { name: '다음' }).click();
    
    // 감정 선택 페이지로 이동 확인
    await expect(page.getByRole('heading', { name: '지금 느끼는 감정은?' })).toBeVisible();
  });

  test('기타 감정 직접 입력 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 컬러 선택
    await page.locator('button[style*="background-color"]').first().click();
    await page.getByRole('button', { name: '다음' }).click();
    await page.getByRole('button', { name: '다음' }).click();
    
    // 기타 감정 선택
    await page.getByRole('button', { name: '기타' }).click();
    
    // 직접 입력 필드 확인
    const customEmotionInput = page.locator('input[placeholder*="감정을 직접 입력"]');
    await expect(customEmotionInput).toBeVisible();
    
    // 감정 입력
    await customEmotionInput.fill('설렘');
    
    // 다음 버튼 클릭
    await page.getByRole('button', { name: '다음' }).click();
    
    // 입력한 감정이 표시되는지 확인
    await expect(page.getByText('설렘')).toBeVisible();
  });

  test('페이지네이션 테스트 - 이전/다음 버튼', async ({ page }) => {
    await page.goto('/');
    
    // 첫 페이지에서 이전 버튼 비활성화 확인
    const prevButton = page.getByRole('button', { name: '이전' });
    await expect(prevButton).toBeDisabled();
    
    // 컬러 선택 후 다음 버튼 활성화 확인
    await page.locator('button[style*="background-color"]').first().click();
    const nextButton = page.getByRole('button', { name: '다음' });
    await expect(nextButton).toBeEnabled();
    
    // 다음 페이지로 이동
    await nextButton.click();
    
    // 이전 버튼 활성화 확인
    await expect(prevButton).toBeEnabled();
    
    // 이전 버튼 클릭
    await prevButton.click();
    
    // 첫 페이지로 돌아왔는지 확인
    await expect(page.getByRole('heading', { name: '지금 가장 끌리는 컬러를 선택해주세요' })).toBeVisible();
  });

  test('진행 바 확인 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 첫 페이지에서 진행 바 확인
    await expect(page.getByText('1 / 8')).toBeVisible();
    
    // 다음 페이지로 이동
    await page.locator('button[style*="background-color"]').first().click();
    await page.getByRole('button', { name: '다음' }).click();
    
    // 진행 바 업데이트 확인
    await expect(page.getByText('2 / 8')).toBeVisible();
  });
});

