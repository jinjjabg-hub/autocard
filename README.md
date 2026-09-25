# 자동 명함(AutoCard)

5분이면 끝나는 디지털 명함 — 5,900원부터, 카드북 저장까지 한 번에.

- 제작 앱: https://jinjjabg-hub.github.io/autocard/
- 공개 명함: https://jinjjabg-hub.github.io/autocard/c/?id={cardId}
- 관리자 승인: https://jinjjabg-hub.github.io/autocard/admin.html

## 구조
- 데이터: Firebase `mandu-e7c3c` (카드북과 공용) → Firestore `autocards`, Storage `autocards/{cardId}/`
- 보안 규칙·Worker(AI 초안·번역, 50장 보너스): `cardbook` 레포의 `firestore.rules`, `storage.rules`, `worker.js`
- `assets/card.js`: 템플릿 6종 + 색상·글자 대비 계산 (미리보기와 공개 명함이 같은 코드 사용)

## 매일 쓰는 법
고객에게 제작 앱 링크 전송 → 발행 요청이 오면 admin.html에서 입금 확인 후 **승인·발행**.
