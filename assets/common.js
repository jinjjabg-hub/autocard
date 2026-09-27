// ===== AutoCard 공통 설정 =====
// 카드북과 같은 Firebase 프로젝트(mandu-e7c3c)를 쓴다 → 같은 로그인, 같은 DB.
// 이 키는 공개용(웹 API 키)이라 브라우저에 있어도 된다. AI 키는 Worker Secret에만 있다.
const AC_FIREBASE = {
  apiKey: "AIzaSyAZoWSGSA81daZydNgzegct2aaeFbDajr0",
  authDomain: "mandu-e7c3c.firebaseapp.com",
  projectId: "mandu-e7c3c",
  storageBucket: "mandu-e7c3c.firebasestorage.app",
  messagingSenderId: "196338490174",
  appId: "1:196338490174:web:78dc77e684945aca362a6f"
};
const AC_WORKER = 'https://cardbook-ai.jinjjabg.workers.dev';
const AC_CARDBOOK = 'https://jinjjabg-hub.github.io/cardbook/';
// 비즈홈(T.M LINK) — 명함보다 자세히 보여주고 싶은 사람에게 6단계에서 안내. 가격은 T.M-LINK 사이트와 같게 유지
const AC_BIZHOME = 'https://jinjjabg-hub.github.io/T.M-LINK/';
const AC_BIZHOME_EX = 'https://jinjjabg-hub.github.io/DiCA-gallery/';
const AC_BIZHOME_PLANS = [['BASIC', 150000, 'bh_basic'], ['STANDARD', 210000, 'bh_std'], ['PREMIUM', 270000, 'bh_prem']];
const AC_ADMIN_EMAILS = ['jinjjabg@gmail.com'];   // firestore.rules의 관리자 이메일과 같아야 함

// 가격: 기본 1개 언어 5,900원 + 추가 언어당 5,000원, 최대 4개 언어
const AC_BASE_PRICE = 5900, AC_EXTRA_LANG_PRICE = 5000, AC_MAX_LANGS = 4, AC_MAX_LINKS = 3;
function acPrice(langs) { return AC_BASE_PRICE + Math.max(0, (langs || []).length - 1) * AC_EXTRA_LANG_PRICE; }
function acWon(n) { return n.toLocaleString('ko-KR') + '원'; }
// 토스페이먼츠 클라이언트 키(공개용) — 카드북과 같은 상점. 심사 통과 후 live_ck_ 로 교체
const AC_TOSS_CLIENT_KEY = 'test_ck_PBal2vxj811KJW5OMqpR85RQgOAN';

function acInitFirebase() {
  if (!firebase.apps.length) firebase.initializeApp(AC_FIREBASE);
  return { auth: firebase.auth(), db: firebase.firestore() };
}

// 공개 명함 주소 — 카드북 저장·QR·공유에 모두 이 주소를 쓴다
function acCardUrl(id) {
  const base = location.origin + location.pathname.replace(/\/(c\/)?(index\.html|admin\.html)?$/, '/');
  return base + 'c/?id=' + encodeURIComponent(id);
}
