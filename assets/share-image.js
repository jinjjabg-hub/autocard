// ===== 명함 → 이미지 (인스타 스토리·피드 / PPT / 카톡 프로필) =====
// 명함 데이터와 색(card.design)으로 캔버스에 직접 그린다 → 별도 라이브러리·화면 캡처 없이 선명한 PNG.
// QR이 들어가므로 이미지를 올려도 보는 사람이 스캔하면 살아있는 명함으로 연결된다.
const AC_IMG_FORMATS = {
  story: { w: 1080, h: 1920, file: 'insta-story' },   // 인스타 스토리 9:16 (위·아래 약 250px은 앱 UI에 가려져 비워둠)
  feed: { w: 1080, h: 1350, file: 'insta-feed' },     // 인스타 피드 4:5
  ppt: { w: 1920, h: 1080, file: 'ppt' },             // PPT 16:9
  kakao: { w: 1080, h: 1080, file: 'kakao-profile' }, // 카톡 프로필 1:1 — 원형으로 잘려도 이름이 보이게 가운데에 모음
};
const AC_IMG_FONT = "'Pretendard Variable', Pretendard, 'Noto Sans KR', system-ui, sans-serif";

function acImgLoad(src) {   // 사진: CORS 허용이 안 되면(캔버스 오염) 사진 없이 이니셜로 대체
  return new Promise(res => { if (!src) return res(null); const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
}
function acImgQr(url, size) {
  return new Promise(res => {
    if (typeof QRCode === 'undefined') return res(null);
    const box = document.createElement('div');
    try { new QRCode(box, { text: url, width: size, height: size, correctLevel: QRCode.CorrectLevel.M }); } catch (e) { return res(null); }
    setTimeout(() => res(box.querySelector('canvas')), 30);
  });
}
function acRR(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// 줄바꿈: 공백 단위로, 한 단어가 너무 길면 글자 단위로. maxLines 넘으면 …
function acWrap(c, text, maxW, maxLines) {
  const lines = []; let cur = '';
  for (const raw of String(text || '').split('\n')) {
    for (const tok of raw.match(/\S+\s*|\s+/g) || ['']) {
      if (c.measureText(cur + tok).width <= maxW) { cur += tok; continue; }
      if (cur) { lines.push(cur.trimEnd()); cur = ''; }
      for (const ch of tok) { if (c.measureText(cur + ch).width > maxW && cur) { lines.push(cur); cur = ''; } cur += ch; }
    }
    lines.push(cur.trimEnd()); cur = '';
  }
  if (lines.length > maxLines) { lines.length = maxLines; let l = lines[maxLines - 1]; while (l && c.measureText(l + '…').width > maxW) l = l.slice(0, -1); lines[maxLines - 1] = l + '…'; }
  return lines;
}
// 글자 그리기. 한 줄이 maxW보다 길면 글자 크기를 줄여 맞춘다. 그린 뒤 다음 y를 돌려줌
function acTxt(c, text, x, y, o) {
  if (!text) return y;
  let size = o.size; const wt = o.weight || 600;
  c.font = `${wt} ${size}px ${AC_IMG_FONT}`;
  if (o.fit) while (size > o.size * 0.55 && c.measureText(text).width > o.maxW) { size -= 2; c.font = `${wt} ${size}px ${AC_IMG_FONT}`; }
  c.fillStyle = o.color; c.textAlign = o.align || 'left'; c.textBaseline = 'top';
  const lines = o.lines ? acWrap(c, text, o.maxW, o.lines) : [text];
  const lh = o.lh || size * 1.3;
  lines.forEach((l, i) => c.fillText(l, x, y + i * lh));
  return y + lines.length * lh;
}
function acPhoto(c, img, v, cx, cy, r, p) {
  c.save(); c.beginPath(); c.arc(cx, cy, r + 10, 0, 7); c.fillStyle = p.point; c.fill(); c.restore();   // 강조색 테두리
  c.save(); c.beginPath(); c.arc(cx, cy, r, 0, 7); c.clip();
  if (img) { const s = Math.max(2 * r / img.width, 2 * r / img.height); c.drawImage(img, cx - img.width * s / 2, cy - img.height * s / 2, img.width * s, img.height * s); }
  else { c.fillStyle = p.surface; c.fillRect(cx - r, cy - r, 2 * r, 2 * r); c.fillStyle = p.accentSurface; c.font = `800 ${r}px ${AC_IMG_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText((v.name || '?').trim().charAt(0), cx, cy + r * 0.05); }
  c.restore();
}
function acQrBox(c, qr, x, y, s) { c.fillStyle = '#fff'; acRR(c, x, y, s, s, s * 0.08); c.fill(); if (qr) { const m = s * 0.07; c.drawImage(qr, x + m, y + m, s - 2 * m, s - 2 * m); } }

// 캔버스를 만들어 돌려준다. fmt: story | feed | ppt | kakao
async function acShareCanvas(card, lang, fmt, url) {
  const F = AC_IMG_FORMATS[fmt], W = F.w, H = F.h, v = acView(card, lang);
  const d = card.design || {}, p = acPalette({ ...d, tpl: 'minimal' });   // 템플릿과 상관없이 같은 색 규칙(글자 대비 자동 보정)
  await Promise.all([document.fonts.load(`800 48px ${AC_IMG_FONT}`), document.fonts.load(`500 48px ${AC_IMG_FONT}`), document.fonts.ready].map(x => Promise.resolve(x).catch(() => 0)));
  const [photo, qr] = await Promise.all([acImgLoad(v.profile), acImgQr(url, 512)]);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const onM = p.onMain, role = [v.title, v.company].filter(Boolean).join(' · ');
  const dim = onM === '#FFFFFF' ? 0.78 : 0.7;   // 보조 글자색(흐리게)
  const sub = acMix(p.main, onM, dim);
  const bgGrad = c.createLinearGradient(0, 0, W * 0.3, H); bgGrad.addColorStop(0, p.main); bgGrad.addColorStop(1, acMix(p.main, '#000000', 0.28));

  if (fmt === 'ppt') {
    const lw = 760; c.fillStyle = bgGrad; c.fillRect(0, 0, lw, H); c.fillStyle = p.sub; c.fillRect(lw, 0, W - lw, H);
    acPhoto(c, photo, v, lw / 2, 410, 220, p);
    let y = acTxt(c, v.name, lw / 2, 690, { size: 84, weight: 800, color: onM, align: 'center', maxW: lw - 120, fit: true });
    y = acTxt(c, v.name2, lw / 2, y + 4, { size: 36, weight: 500, color: sub, align: 'center', maxW: lw - 120, fit: true });
    if (v.chapter) acTxt(c, v.chapter, lw / 2, y + 26, { size: 30, weight: 700, color: p.accentMain, align: 'center', maxW: lw - 120, fit: true });
    const x = lw + 110, mw = W - x - 110, on = p.onBg; let ry = 130;
    ry = acTxt(c, role, x, ry, { size: 44, weight: 700, color: p.accentBg, maxW: mw, lines: 2 });
    c.fillStyle = p.point; c.fillRect(x, ry + 18, 90, 6); ry += 56;
    ry = acTxt(c, v.slogan, x, ry, { size: 58, weight: 800, color: on, maxW: mw, lines: 3, lh: 78 });
    let sy = ry + 30;   // 전문분야 알약
    c.font = `600 30px ${AC_IMG_FONT}`; let sx = x;
    for (const s of v.specialties.slice(0, 5)) {
      const w = c.measureText(s).width + 44; if (sx + w > x + mw) { sx = x; sy += 66; }
      c.fillStyle = p.surface; acRR(c, sx, sy, w, 52, 26); c.fill(); c.fillStyle = p.onSurface; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(s, sx + 22, sy + 27); sx += w + 14;
    }
    let cy = H - 330; const rows = [v.phone, v.email, ...v.links.map(l => acPretty(acSafeUrl(l.url)))].filter(Boolean).slice(0, 3);
    rows.forEach(r => { cy = acTxt(c, r, x, cy, { size: 36, weight: 600, color: on, maxW: mw - 260, fit: true }) + 14; });
    acQrBox(c, qr, W - 110 - 230, H - 110 - 230, 230);
  } else if (fmt === 'kakao') {
    c.fillStyle = bgGrad; c.fillRect(0, 0, W, H);
    acPhoto(c, photo, v, W / 2, 320, 180, p);
    let y = acTxt(c, v.name, W / 2, 550, { size: 124, weight: 800, color: onM, align: 'center', maxW: 700, fit: true });
    y = acTxt(c, role, W / 2, y + 6, { size: 46, weight: 600, color: sub, align: 'center', maxW: 680, fit: true });
    c.fillStyle = p.point; c.fillRect(W / 2 - 45, y + 24, 90, 6);
    acTxt(c, v.slogan, W / 2, y + 62, { size: 40, weight: 500, color: onM, align: 'center', maxW: 560, lines: 2, lh: 54 });
  } else {   // story / feed — 세로형
    c.fillStyle = bgGrad; c.fillRect(0, 0, W, H);
    const story = fmt === 'story', top = story ? 290 : 90, pr = story ? 200 : 150;
    acPhoto(c, photo, v, W / 2, top + pr, pr, p);
    let y = top + 2 * pr + (story ? 70 : 56);
    if (v.chapter) y = acTxt(c, v.chapter, W / 2, y, { size: 34, weight: 700, color: p.accentMain, align: 'center', maxW: W - 200, fit: true }) + 14;
    y = acTxt(c, v.name, W / 2, y, { size: story ? 112 : 96, weight: 800, color: onM, align: 'center', maxW: W - 160, fit: true });
    y = acTxt(c, v.name2, W / 2, y + 2, { size: 40, weight: 500, color: sub, align: 'center', maxW: W - 160, fit: true });
    y = acTxt(c, role, W / 2, y + 10, { size: 46, weight: 600, color: onM, align: 'center', maxW: W - 160, lines: 2 });
    c.fillStyle = p.point; c.fillRect(W / 2 - 45, y + 20, 90, 6); y += 56;
    acTxt(c, v.slogan, W / 2, y, { size: story ? 54 : 46, weight: 700, color: onM, align: 'center', maxW: W - 200, lines: story ? 4 : 3, lh: story ? 74 : 64 });
    const qs = story ? 250 : 220, qy = H - (story ? 250 : 90) - qs, qx = 120;
    acQrBox(c, qr, qx, qy, qs);
    const tx = qx + qs + 50, tw = W - tx - 100; let ty = qy + 10;
    ty = acTxt(c, v.ui.qr, tx, ty, { size: 30, weight: 700, color: p.accentMain, maxW: tw, fit: true }) + 8;
    [v.phone, v.email].filter(Boolean).forEach(r => { ty = acTxt(c, r, tx, ty, { size: 38, weight: 600, color: onM, maxW: tw, fit: true }) + 8; });
  }
  return cv;
}
