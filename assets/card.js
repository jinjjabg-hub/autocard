// ===== AutoCard 명함 렌더링 (제작 앱 미리보기와 공개 명함 페이지가 같은 코드를 쓴다) =====
// 같은 데이터 → 템플릿 함수 6개 중 하나 → HTML. 그래서 미리보기에서 본 모습 그대로 발행된다.

const AC_LANGS = {
  ko: '한국어', en: 'English', ja: '日本語', zh: '中文', vi: 'Tiếng Việt', mn: 'Монгол',
};

// 명함 화면의 고정 문구(버튼 이름 등) — 사용자가 쓴 문구가 아니므로 AI 번역 없이 미리 준비
const AC_UI = {
  ko: { connect: '연락하기', saveShort: '카드북', specialties: '전문분야', chapter: 'BNI {c} 챕터', work: '하는 일', help: '이런 분을 돕습니다', call: '전화', sms: '문자', email: '이메일', save: '카드북에 저장', saveSub: '받은 명함을 명함첩에 한 번에 보관해요', contact: '연락처 저장', referral: '이런 분을 소개해주세요', share: '명함 공유', qr: 'QR 코드', make: '나도 5,900원으로 명함 만들기', copied: '주소가 복사됐어요' },
  en: { connect: 'Get in touch', saveShort: 'CardBook', specialties: 'Specialties', chapter: 'BNI {c} Chapter', work: 'What I do', help: 'Who I help', call: 'Call', sms: 'Text', email: 'Email', save: 'Save to CardBook', saveSub: 'Keep every card you receive in one place', contact: 'Save contact', referral: 'Who I would love to meet', share: 'Share', qr: 'QR code', make: 'Make your own card for ₩5,900', copied: 'Link copied' },
  ja: { connect: '連絡先', saveShort: 'CardBook', specialties: '専門分野', chapter: 'BNI {c} チャプター', work: '仕事内容', help: 'こんな方をお手伝いします', call: '電話', sms: 'SMS', email: 'メール', save: 'CardBookに保存', saveSub: 'もらった名刺をまとめて保管', contact: '連絡先を保存', referral: 'こんな方をご紹介ください', share: '共有', qr: 'QRコード', make: '5,900ウォンで名刺をつくる', copied: 'コピーしました' },
  zh: { connect: '联系方式', saveShort: 'CardBook', specialties: '专业领域', chapter: 'BNI {c} 分会', work: '我的工作', help: '我能帮助的人', call: '电话', sms: '短信', email: '邮件', save: '保存到CardBook', saveSub: '收到的名片一键保存', contact: '保存联系人', referral: '请为我介绍这样的人', share: '分享', qr: '二维码', make: '5,900韩元制作我的名片', copied: '已复制' },
  vi: { connect: 'Liên hệ', saveShort: 'CardBook', specialties: 'Lĩnh vực chuyên môn', chapter: 'BNI Chapter {c}', work: 'Công việc của tôi', help: 'Tôi giúp ai', call: 'Gọi', sms: 'Nhắn tin', email: 'Email', save: 'Lưu vào CardBook', saveSub: 'Lưu mọi danh thiếp ở một nơi', contact: 'Lưu danh bạ', referral: 'Xin giới thiệu giúp tôi', share: 'Chia sẻ', qr: 'Mã QR', make: 'Tạo danh thiếp chỉ 5.900₩', copied: 'Đã sao chép' },
  mn: { connect: 'Холбоо барих', saveShort: 'CardBook', specialties: 'Мэргэшсэн чиглэл', chapter: 'BNI {c} бүлэг', work: 'Миний ажил', help: 'Би хэнд тусалдаг вэ', call: 'Залгах', sms: 'Мессеж', email: 'И-мэйл', save: 'CardBook-д хадгалах', saveSub: 'Нэрийн хуудсаа нэг дор хадгална', contact: 'Холбоо барих хадгалах', referral: 'Ийм хүмүүсийг танилцуулна уу', share: 'Хуваалцах', qr: 'QR код', make: '5,900₩-өөр нэрийн хуудас хийх', copied: 'Хуулсан' },
};

// ===== 색상 =====
// 추천 조합 10개 [이름, main(히어로 배경), sub(바탕), point(버튼·강조)]
const AC_PRESETS = [
  ['네이비 클래식', '#1F3A5F', '#E8E1D3', '#C8963E'],
  ['포레스트', '#2F4A3A', '#EDE8DC', '#D07A3B'],
  ['버건디', '#6B2737', '#F1E6DF', '#C9A36B'],
  ['차콜 민트', '#2B2D31', '#E6EEEA', '#3FA58A'],
  ['오션 선셋', '#0F4C75', '#E3EEF4', '#F2A541'],
  ['테라코타', '#B5543A', '#F4EBE1', '#2E4057'],
  ['라벤더 골드', '#4B3F72', '#EEEAF5', '#E0A458'],
  ['모노', '#1C1C1C', '#F2F2F0', '#8A8A85'],
  ['올리브', '#5A5A2E', '#F0EEE2', '#B85C38'],
  ['스카이 코랄', '#2E6F95', '#F5F1EC', '#E76F51'],
];
// 직접 선택용 스와치 (각 8색)
const AC_SWATCH = {
  main: ['#1F3A5F', '#2F4A3A', '#6B2737', '#2B2D31', '#0F4C75', '#B5543A', '#4B3F72', '#1C1C1C'],
  sub: ['#FFFFFF', '#E8E1D3', '#EDE8DC', '#F1E6DF', '#E6EEEA', '#E3EEF4', '#EEEAF5', '#F5F1EC'],
  point: ['#C8963E', '#D07A3B', '#3FA58A', '#F2A541', '#E76F51', '#2E4057', '#E0A458', '#8A8A85'],
};

// 글꼴 5종 — 제목(head)·본문(body). 영문 보조 이름과 머리말은 모든 글꼴 공통(Playfair Display)
const AC_FONTS = {
  modern: { label: '모던', sample: '깔끔한 고딕', css: ['https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'] },
  classic: { label: '클래식', sample: '단정한 명조', css: ['https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700;900&display=swap'] },
  elegant: { label: '우아한', sample: '부드러운 바탕', css: ['https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap'] },
  soft: { label: '친근한', sample: '둥근 돋움', css: ['https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap'] },
  bold: { label: '강렬한', sample: '굵은 제목', css: ['https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap'] },
};
const AC_FONT_BASE = ['https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500&display=swap'];
function acLoadFont(key) {   // 고른 글꼴만 그때그때 불러옴(페이지가 무거워지지 않게)
  if (typeof document === 'undefined') return;
  [...AC_FONT_BASE, ...((AC_FONTS[key] || AC_FONTS.modern).css)].forEach(href => {
    if (document.querySelector(`link[data-acfont="${href}"]`)) return;
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; l.dataset.acfont = href; document.head.appendChild(l);
  });
}
// 템플릿별 기본 글꼴(사용자가 고르지 않았을 때)
const AC_TPL_FONT = { minimal: 'modern', split: 'modern', badge: 'soft', magazine: 'classic', dark: 'modern', block: 'bold' };

const AC_TEMPLATES = {
  minimal: '미니멀 센터형', split: '대각선 스플릿형', badge: '플로팅 배지형',
  magazine: '매거진 에디토리얼형', dark: '다크 프리미엄형', block: '컬러 블록형',
};

function acHexRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }
function acRgbHex(r) { return '#' + r.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase(); }
function acLum(hex) {
  const [r, g, b] = acHexRgb(hex).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
// WCAG 대비율 (1~21)
function acContrast(a, b) { const x = acLum(a), y = acLum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
const AC_WHITE = '#FFFFFF', AC_INK = '#141414';
// 글자색 자동: 흰색/검정 중 배경과 대비가 큰 쪽
function acTextOn(bg) { return acContrast(bg, AC_WHITE) >= acContrast(bg, AC_INK) ? AC_WHITE : AC_INK; }
function acMix(a, b, t) { const x = acHexRgb(a), y = acHexRgb(b); return acRgbHex(x.map((v, i) => v + (y[i] - v) * t)); }
// 강조색을 글자로 쓸 때: 배경과 대비 4.5(WCAG AA, 작은 글자 기준) 이상이면 point, 아니면 자동 글자색으로 대체
// → 어떤 조합을 골라도 글자가 흐려지는 일이 없다
function acAccentOn(point, bg) { return acContrast(point, bg) >= 4.5 ? point : acTextOn(bg); }

// 직접 선택 시 대비 경고 (시안 기준: point↔sub 2 미만, main↔sub 1.5 미만)
function acColorWarnings(d) {
  const w = [];
  if (acContrast(d.point, d.sub) < 2) w.push('강조색과 바탕색이 비슷해 버튼이 잘 안 보일 수 있어요');
  if (acContrast(d.main, d.sub) < 1.5) w.push('메인색과 바탕색이 비슷해 경계가 흐려 보여요');
  return w;
}

// 이미지에서 가져온 색 보정: 경고 기준(바탕↔메인 1.5, 바탕↔강조 2)을 넘을 때까지 조금씩 밝히거나 어둡게 → 원래 느낌은 살리고 구분은 확실하게
function acFixColors(c) {
  let { main, sub, point } = c;
  const nudge = (col, toward) => acMix(col, toward, 0.06);
  // 흰/검 글자 중 어느 쪽도 4.5가 안 되는 중간 밝기 색이면 가까운 쪽(밝게/어둡게)으로 밀어 글자가 읽히게
  const readable = col => { for (let i = 0; i < 40 && acContrast(col, acTextOn(col)) < 4.5; i++) col = nudge(col, acLum(col) > 0.18 ? '#FFFFFF' : '#000000'); return col; };
  // from과 대비가 min 이상 될 때까지 멀어지게
  const away = (col, from, min) => { const to = acLum(from) > 0.4 ? '#000000' : '#FFFFFF'; for (let i = 0; i < 40 && acContrast(col, from) < min; i++) col = nudge(col, to); return col; };
  sub = readable(sub); main = readable(main); point = readable(point);
  if (acContrast(main, sub) < 1.5) main = readable(away(main, sub, 1.5));
  if (acContrast(point, sub) < 2) point = readable(away(point, sub, 2));
  // 메인과 포인트가 거의 같은 색이면(예: 금색+금색) 포인트가 강조 역할을 못 함 → 메인을 바탕 반대쪽으로 진하게/연하게 한 톤을 포인트로
  if (acContrast(main, point) < 1.4) point = readable(acMix(main, acLum(sub) > 0.4 ? '#000000' : '#FFFFFF', 0.45));
  return { main, sub, point };
}

// 템플릿에서 쓰는 모든 색을 한 번에 계산 → CSS 변수로 주입
function acPalette(design) {
  const main = design.main, sub = design.sub, point = design.point;
  const dark = design.tpl === 'dark';
  const bg = dark ? acMix(main, '#000000', 0.78) : sub;          // 페이지 바탕
  const surface = dark ? acMix(main, '#000000', 0.62) : acMix(sub, '#FFFFFF', 0.55); // 카드 면
  return {
    main, sub, point, bg, surface,
    onMain: acTextOn(main), onBg: acTextOn(bg), onSurface: acTextOn(surface), onPoint: acTextOn(point),
    accentBg: acAccentOn(point, bg), accentMain: acAccentOn(point, main), accentSurface: acAccentOn(point, surface),
    line: acMix(bg, acTextOn(bg), 0.2),
  };
}

// ===== 데이터 읽기 =====
function acEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function acPick(field, lang, card) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field[(card.langs || [])[0]] || Object.values(field).find(Boolean) || '';
}
function acView(card, lang) {
  const base = (card.langs || [])[0];
  const cur = (card.copy && card.copy[lang]) || {}, org = (card.copy && card.copy[base]) || {}, ans = card.answers || {};
  // 필드별로: 이 언어 문구 → 기본 언어 문구 → 질문 답변 원문 순으로 채운다
  // (work·help가 없던 예전 명함도 답변 원문이 대신 나와서 섹션이 비지 않음)
  const pick = (k, a) => cur[k] || org[k] || (a ? ans[a] || '' : '');
  return {
    name: acPick(card.name, lang, card), title: acPick(card.title, lang, card), company: acPick(card.company, lang, card),
    slogan: pick('slogan'), work: pick('work', 'work'), help: pick('help', 'customer'), referral: pick('referral', 'referral'),
    specialties: ((cur.specialties && cur.specialties.length ? cur.specialties : org.specialties) || []).filter(Boolean),
    phone: card.phone || '', phone2: card.phone2 || '', email: card.email || '', links: (card.links || []).filter(l => l && l.url),
    profile: (card.images || {}).profile || '', second: (card.images || {}).second || '',
    secondType: (card.images || {}).secondType || 'hero',
    ui: AC_UI[lang] || AC_UI.en,
    // 이름 아래 작은 보조 이름: 지금 언어가 아닌 영어(없으면 기본 언어) 이름
    name2: (() => { const n = card.name || {}, cur = acPick(n, lang, card); const alt = lang !== 'en' ? n.en : n[base]; return alt && alt !== cur ? alt : ''; })(),
    chapter: card.chapter && card.showChapter !== false ? (AC_UI[lang] || AC_UI.en).chapter.replace('{c}', card.chapter) : '',
    // 인물 사진을 상단에 크게 (BNI 이미지 명함들의 공통점). 예전 명함은 design.photo가 없으므로 작은 사진 그대로
    large: !!((card.images || {}).profile && (card.design || {}).photo === 'large'),
  };
}
function acSafeUrl(u) {
  u = String(u || '').trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  return u;
}

// ===== 공통 블록 — 모든 템플릿이 같은 블록을 쓰고, 모양은 card.css의 .tpl-* 가 템플릿별로 다르게 입힌다 =====
const AC_SVG = (d, size = 20) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const AC_ICON = {
  call: AC_SVG('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
  sms: AC_SVG('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  email: AC_SVG('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
  link: AC_SVG('<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>', 16),
  book: AC_SVG('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/><path d="M6.5 17A2.5 2.5 0 0 0 4 19.5 2.5 2.5 0 0 0 6.5 22H20v-5"/>', 24),
  contact: AC_SVG('<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>'),
  share: AC_SVG('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>'),
  qr: AC_SVG('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v.01M14 20v.01M17 20h4v-3"/>'),
  chevron: AC_SVG('<path d="m9 18 6-6-6-6"/>', 16),
  insta: AC_SVG('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>'),
};

function acAvatar(v, cls) {
  const initial = acEsc((v.name || '?').trim().charAt(0));
  return v.profile
    ? `<img class="${cls}" src="${acEsc(v.profile)}" alt="${acEsc(v.name)}">`
    : `<div class="${cls} ac-initial">${initial}</div>`;
}
function acLogo(v) { return v.second && v.secondType === 'logo' ? `<img class="ac-logo" src="${acEsc(v.second)}" alt="logo">` : ''; }
function acHeroBg(v) { return v.second && v.secondType === 'hero' ? `<div class="ac-hero-img" style="background-image:url('${acEsc(v.second)}')"></div><div class="ac-hero-veil"></div>` : ''; }
function acRole(v) { return [v.title, v.company].filter(Boolean).map(acEsc).join(' · '); }

// ===== DiCA 디자인 언어 — 작은 영문 머리말 + 큰 제목, 이름 위계, 연락처 줄, 하단 고정 바 =====
const AC_KICK = { work: 'ABOUT', spec: 'SPECIALTIES', help: 'WHO I HELP', referral: 'REFERRAL', connect: 'CONNECT' };
function acHead(key, title, i) {
  return `<div class="ac-head"><span class="ac-kick">${AC_KICK[key]}</span>
    <h3 class="ac-h"><span class="ac-num">${String(i).padStart(2, '0')}</span><span class="ac-ht">${title}</span></h3></div>`;
}
// 이름 블록: 챕터 배지 → 이름 → 보조 이름(영문 기울임) → 직함·회사 → 짧은 강조선 → (옵션) 한 줄 소개
function acIdentity(v, opt = {}) {
  return `<div class="ac-id">${opt.avatar ? acAvatar(v, 'ac-photo') : ''}<div class="ac-idt">${acChapter(v)}
    <h1>${acEsc(v.name)}</h1>${v.name2 ? `<div class="ac-name2">${acEsc(v.name2)}</div>` : ''}
    <div class="ac-role">${acRole(v)}</div><i class="ac-rule"></i>
    ${opt.slogan && v.slogan ? `<p class="ac-slogan">${acEsc(v.slogan)}</p>` : ''}</div></div>`;
}
// 본문 섹션: 하는 일 → 전문분야 → 이런 분을 돕습니다 → 이런 분을 소개해주세요
function acSections(v) {
  const list = [['work', v.ui.work, v.work], ['spec', v.ui.specialties, v.specialties], ['help', v.ui.help, v.help], ['referral', v.ui.referral, v.referral]]
    .filter(x => Array.isArray(x[2]) ? x[2].length : x[2]);
  return list.map(([k, title, body], i) => {
    let inner;
    if (Array.isArray(body)) inner = `<ul class="ac-list">${body.map(x => `<li>${acEsc(x)}</li>`).join('')}</ul>`;
    else if (k === 'referral') {   // 줄바꿈으로 나뉜 리퍼럴은 알약 목록, 한 문장이면 인용 카드
      const lines = body.split('\n').map(x => x.trim()).filter(Boolean);
      inner = lines.length > 1 ? `<ul class="ac-list ac-reflist">${lines.map(x => `<li>${acEsc(x)}</li>`).join('')}</ul>` : `<div class="ac-box ac-quote"><p>${acEsc(body)}</p></div>`;
    } else inner = `<div class="ac-box"><p>${acEsc(body)}</p></div>`;
    return `<section class="ac-sec ac-sec-${k}">${acHead(k, title, i + 1)}${inner}</section>`;
  }).join('');
}
function acChapter(v) { return v.chapter ? `<span class="ac-chapter"><i></i>${acEsc(v.chapter)}</span>` : ''; }
function acBig(v) { return `<img class="ac-big" src="${acEsc(v.profile)}" alt="${acEsc(v.name)}">`; }
function acSaveBtn(v) {
  return `<button type="button" class="ac-save" data-ac="save">${AC_ICON.book}<span class="ac-save-t"><b>${v.ui.save}</b><small>${v.ui.saveSub}</small></span>${AC_ICON.chevron}</button>`;
}
// 연락하기: 아이콘 상자 + 영문 라벨 + 값 (DiCA의 CONNECT)
const acPretty = u => String(u || '').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
function acConnect(v) {
  const rows = [];
  if (v.phone) rows.push(['tel:' + v.phone.replace(/[^0-9+]/g, ''), AC_ICON.call, 'PHONE', v.phone]);
  if (v.email) rows.push(['mailto:' + v.email, AC_ICON.email, 'EMAIL', v.email]);
  v.links.forEach(l => { const url = acSafeUrl(l.url), ig = /instagram\.com/i.test(url);
    rows.push([url, ig ? AC_ICON.insta : AC_ICON.link, ig ? 'INSTAGRAM' : (l.label || 'LINK'), acPretty(url), true]); });
  if (!rows.length) return '';
  return `<section class="ac-sec ac-sec-connect">${acHead('connect', v.ui.connect, 0)}<div class="ac-crows">${rows.map(([href, ic, lab, val, ext]) =>
    `<a class="ac-crow" href="${acEsc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}><i>${ic}</i><span><b>${acEsc(lab)}</b><em>${acEsc(val)}</em></span></a>`).join('')}</div></section>`;
}
// 맨 아래 작은 아이콘 3개 — 연락처 저장·공유·QR
function acTools(v) {
  const t = [['vcf', AC_ICON.contact, v.ui.contact], ['share', AC_ICON.share, v.ui.share], ['qr', AC_ICON.qr, v.ui.qr]];
  return `<div class="ac-tools">${t.map(([k, ic, lb]) => `<button type="button" data-ac="${k}" aria-label="${lb}"><i>${ic}</i><span>${lb}</span></button>`).join('')}</div>`;
}
function acFooter(v) { return `<a class="ac-make" href="../?from=card" data-ac="make">${v.ui.make} →</a>`; }
// 화면 아래 고정 바: 전화·문자·메일·카드북 — 스크롤해도 늘 한 번에 누를 수 있게
function acDock(v) {
  const b = [];
  if (v.phone) { const tel = v.phone.replace(/[^0-9+]/g, '');
    b.push(`<a href="tel:${tel}">${AC_ICON.call}<span>${v.ui.call}</span></a>`, `<a href="sms:${tel}">${AC_ICON.sms}<span>${v.ui.sms}</span></a>`); }
  if (v.email) b.push(`<a href="mailto:${acEsc(v.email)}">${AC_ICON.email}<span>${v.ui.email}</span></a>`);
  b.push(`<button type="button" data-ac="save" class="ac-dock-save">${AC_ICON.book}<span>${v.ui.saveShort}</span></button>`);
  return `<nav class="ac-dock">${b.join('')}</nav>`;
}
function acBody(v, opt = {}) {
  return `<main class="ac-main">
    ${v.slogan && !opt.noSlogan ? `<p class="ac-slogan ac-slogan-body">${acEsc(v.slogan)}</p>` : ''}
    <div class="ac-secs">${acSections(v)}</div>
    ${acSaveBtn(v)}${acConnect(v)}${acTools(v)}${acFooter(v)}
  </main>${acDock(v)}`;
}
// 사진 없는 상단(히어로): 배경 사진이 있으면 그것, 없으면 템플릿 패턴(CSS)
function acTop(v, inner = '') { return `<header class="ac-hero">${v.large ? acBig(v) : acHeroBg(v)}${acLogo(v)}${inner}</header>`; }

// ===== 템플릿 6종 — 같은 디자인 언어 위에서 배치·질감·색 쓰는 법이 다르다 =====
const AC_TPL = {
  // 1. 미니멀 센터형 — 밝은 바탕, 둥근 사진 카드, 가운데 정렬, 얇은 구분선
  minimal(v) {
    return `${acTop(v)}${acIdentity(v, { avatar: !v.large })}${acBody(v)}`;
  },
  // 2. 대각선 스플릿형 — 메인색 면과 사진이 사선으로 나뉨, 이름은 색 면 위
  split(v) {
    return `<header class="ac-hero">${acHeroBg(v)}
        <div class="ac-split-photo">${v.profile ? `<img src="${acEsc(v.profile)}" alt="">` : `<div class="ac-initial">${acEsc((v.name || '?').charAt(0))}</div>`}</div>
        ${acLogo(v)}${acIdentity(v)}
      </header>${acBody(v)}`;
  },
  // 3. 플로팅 배지형 — 사진 위에 떠 있는 이름 카드, 섹션도 떠 있는 둥근 카드
  badge(v) {
    return `${acTop(v)}<div class="ac-float">${acIdentity(v, { avatar: !v.large })}</div>${acBody(v)}`;
  },
  // 4. 매거진 에디토리얼형 — 제호 줄, 표지 사진, 큰 세리프 이름, 번호 붙은 섹션
  magazine(v) {
    return `<header class="ac-hero">${acHeroBg(v)}
        <div class="ac-mag-top"><span>${acEsc(v.company || v.title)}</span>${acLogo(v)}</div>
        ${v.profile ? `<img class="ac-mag-photo" src="${acEsc(v.profile)}" alt="">` : `<div class="ac-mag-cover"><span>${acEsc((v.name || '?').trim().charAt(0))}</span></div>`}
      </header>${acIdentity(v)}${acBody(v)}`;
  },
  // 5. 다크 프리미엄형(DiCA와 가장 가까움) — 꽉 찬 사진이 어둠으로 녹아들고 이름이 그 위에
  dark(v) {
    return `${acTop(v, acIdentity(v, { avatar: !v.large && !v.second, slogan: true }))}${acBody(v, { noSlogan: true })}`;
  },
  // 6. 컬러 블록형 — 사진 → 메인색 이름 블록 → 강조색 한 줄 소개 → 섹션마다 색 면 교차
  block(v) {
    return `${v.large ? `<div class="ac-bigwrap">${acBig(v)}</div>` : ''}<header class="ac-hero">${acHeroBg(v)}${acLogo(v)}${acIdentity(v, { avatar: !v.large })}</header>
      ${v.slogan ? `<div class="ac-band"><p>${acEsc(v.slogan)}</p></div>` : ''}${acBody(v, { noSlogan: true })}`;
  },
};

// 명함 전체 HTML — 이 문자열을 넣을 요소에 class="ac-card"와 CSS 변수가 붙는다
function acRender(el, card, lang) {
  const design = card.design || {};
  const tpl = AC_TPL[design.tpl] ? design.tpl : 'minimal';
  const p = acPalette({ ...design, tpl });
  const v = acView(card, lang);
  const font = AC_FONTS[design.font] ? design.font : AC_TPL_FONT[tpl];
  acLoadFont(font);
  el.className = 'ac-card tpl-' + tpl + (v.second && v.secondType === 'hero' ? ' has-hero' : '') + (v.profile ? '' : ' no-photo') + (v.large ? ' photo-large' : '');
  el.dataset.font = font;
  const vars = {
    '--main': p.main, '--sub': p.sub, '--point': p.point, '--bg': p.bg, '--surface': p.surface,
    '--on-main': p.onMain, '--on-bg': p.onBg, '--on-surface': p.onSurface, '--on-point': p.onPoint,
    '--accent-bg': p.accentBg, '--accent-main': p.accentMain, '--accent-surface': p.accentSurface, '--line': p.line,
  };
  for (const [k, val] of Object.entries(vars)) el.style.setProperty(k, val);
  el.lang = lang;
  el.innerHTML = AC_TPL[tpl](v);
}

// vCard(.vcf) — 폰 연락처에 바로 저장
function acVcf(card, lang, url) {
  const v = acView(card, lang);
  const e = s => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', 'FN:' + e(v.name), 'N:' + e(v.name) + ';;;;'];
  if (v.company) lines.push('ORG:' + e(v.company));
  if (v.title) lines.push('TITLE:' + e(v.title));
  if (v.phone) lines.push('TEL;TYPE=CELL:' + v.phone);
  if (v.phone2) lines.push('TEL;TYPE=WORK:' + v.phone2);
  if (v.email) lines.push('EMAIL:' + e(v.email));
  if (url) lines.push('URL:' + url);
  v.links.forEach(l => lines.push('URL:' + acSafeUrl(l.url)));
  const note = [v.slogan, v.work].filter(Boolean).join('\n');
  if (note) lines.push('NOTE:' + e(note));
  lines.push('END:VCARD');
  return lines.join('\r\n');
}
