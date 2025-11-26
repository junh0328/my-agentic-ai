export type SentimentType = "positive" | "negative" | "neutral";

export interface AnalysisResult {
  sentiment: SentimentType;
  score: number;
  confidence: number;
  reason: string;
}

// 제공된 시스템 프롬프트의 논리를 흉내내는 모의 분석 함수
export async function analyzeReviewMock(text: string): Promise<AnalysisResult> {
  // 실제 API 호출 대신 지연 시간 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerText = text.toLowerCase();

  // 1. 반어법/비꼬는 표현 감지 (간단한 키워드 매칭 시뮬레이션)
  if (
    (text.includes("잘도") && text.includes("하겠네")) ||
    (text.includes("참 대단하다") && text.includes("망가진")) ||
    (text.includes("추천") && text.includes("절대 안함"))
  ) {
    return {
      sentiment: "negative",
      score: -0.8,
      confidence: 0.95,
      reason:
        "표면적으로는 긍정적 단어가 사용되었으나, 문맥상 강한 비꼬음이 감지됩니다. '잘도', '대단하다' 등의 표현이 부정적 상황과 결합되어 반어적으로 사용되었습니다.",
    };
  }

  // 2. 한국어 완곡 표현 고려 ('나쁘지 않다')
  if (text.includes("나쁘지 않") || text.includes("나쁘진 않")) {
    return {
      sentiment: "positive",
      score: 0.4,
      confidence: 0.85,
      reason:
        "한국어 완곡 표현 '나쁘지 않다'가 감지되었습니다. 이는 부정의 부정이 아닌, 약한 긍정(보통 만족)을 의미하는 관용적 표현으로 해석됩니다.",
    };
  }

  // 3. 도메인 특수성 (게임 '어려움')
  if (
    (text.includes("어렵") || text.includes("매운맛")) &&
    (text.includes("재미") || text.includes("도전") || text.includes("게임"))
  ) {
    return {
      sentiment: "positive",
      score: 0.7,
      confidence: 0.8,
      reason:
        "도메인 맥락(게임/챌린지)에서 '어렵다', '매운맛'은 성취감과 관련된 긍정적 요소로 평가되었습니다.",
    };
  }

  // 4. 일반적인 부정
  if (
    text.includes("최악") ||
    text.includes("실망") ||
    text.includes("별로") ||
    text.includes("환불") ||
    text.includes("쓰레기")
  ) {
    return {
      sentiment: "negative",
      score: -0.9,
      confidence: 0.92,
      reason:
        "강한 부정적 키워드('최악', '실망' 등)가 다수 포함되어 있으며, 사용자 경험에 대한 명확한 불만이 표출되었습니다.",
    };
  }

  // 5. 일반적인 긍정
  if (
    text.includes("최고") ||
    text.includes("만족") ||
    text.includes("좋아") ||
    text.includes("추천") ||
    text.includes("훌륭")
  ) {
    return {
      sentiment: "positive",
      score: 0.9,
      confidence: 0.95,
      reason:
        "직관적인 긍정 형용사와 추천 의사가 명확히 드러납니다. 전반적인 만족도가 매우 높은 것으로 분석됩니다.",
    };
  }

  // 6. 중립/정보성
  if (text.length > 0) {
    return {
      sentiment: "neutral",
      score: 0.1,
      confidence: 0.6,
      reason:
        "주관적인 감정 표현보다는 객관적인 사실 서술이나 단순 정보 전달 위주의 텍스트입니다. 뚜렷한 긍/부정 시그널이 약합니다.",
    };
  }

  return {
    sentiment: "neutral",
    score: 0.0,
    confidence: 0.0,
    reason: "분석할 텍스트가 충분하지 않습니다.",
  };
}
