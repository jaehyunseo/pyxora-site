# Pyxora Studio — 사이트 정체성 문서

> **최종 업데이트**: 2026-04-14
> **라이브**: https://pyxora.app
> **레포**: https://github.com/jaehyunseo/pyxora-site

---

## 1. 브랜드 정체성

### 이름의 의미
- **Pyxora** (파이조라) = 그리스어 **πύξ** (pyx, "작은 나무 함") + 라틴어 **-ora** ("영역, 장소")
- 직역: "작품을 담는 함이자, 작품이 자라나는 영역"
- 발음: "파이조라" (영어식: PIKS-ora 아님, **PAI-zora**)

### 태그라인
> **A digital forge for curious makers.**

### 미션 / 비전 / 가치
| | |
|---|---|
| **Mission** | We forge curiosity into digital artifacts. |
| **Vision** | A world where software is crafted, not manufactured. |
| **Core Values** | Curiosity · Craft · Slowness · Playfulness · Honesty |

### 설립 / 위치
- **Founded**: 2026년, 서울
- **Location**: Seoul, South Korea
- **Type**: Digital studio · 1인 (현재)
- **Operator**: 익명 메이커 (A Curious Maker)

---

## 2. 핵심 메시지

- "화려함보다 정성, 속도보다 지속"
- "유행을 쫓기보다 본질을 벼려냄"
- "만들고 싶어서 만든 것들" (from-scratch ethos)
- B2C(재미) + B2B(엔터프라이즈) 양립 가능한 스튜디오

---

## 3. 디자인 시스템

### 컬러 팔레트
```css
--bg:       #06060f   /* 기본 배경 (거의 블랙) */
--bg-elev:  #0c0c1c   /* 상승 서피스 */
--surface:  #13132a   /* 카드, 패널 */
--surface-hi:#1c1c3a
--violet:   #7c3aed   /* 포인트 1 — 기술, 전문성 */
--violet-2: #a855f7   /* 밝은 보라 */
--pyx:      #fbbf24   /* 메인 악센트 — 브랜드 노란색 (골드) */
--cyan:     #06b6d4   /* 포인트 2 — 데이터, 분석 */
--pink:     #ec4899   /* 포인트 3 — 장난기, 재미 */
--green:    #10b981   /* 포지티브, 성공 */
--red:      #ef4444   /* 경고, 네거티브 */
--text:     #f5f5f7   /* 기본 텍스트 */
--text-2:   #c4c4d0   /* 보조 텍스트 */
--muted:    #7a7a8c   /* 약한 텍스트 */
--line:     rgba(255,255,255,.08)   /* 경계선 */
--line-hi:  rgba(255,255,255,.16)   /* 강조 경계 */
```

### 타이포그래피
- **헤드라인**: `Space Grotesk` (600~800 weight, letter-spacing: -0.02~-0.05em)
- **본문**: `Pretendard` (400~700 weight, 한글 최적화)
- **모노스페이스**: `JetBrains Mono` (코드, 레이블, 메타데이터)
- Google Fonts에서 로드 (`fonts.googleapis.com`)

### 레이아웃 원칙
- 다크 테마 기본 (블랙 배경 + 골드 악센트)
- 카드/패널은 `border-radius: 16~32px`
- `backdrop-filter: blur()` 지양 (성능 이슈)
- `content-visibility: auto` 활용
- 최대 컨테이너 폭: `max-width: 1280px`

### 애니메이션 원칙
- 무한 루프 애니메이션 **지양** (CPU 부담)
- 트랜지션: `cubic-bezier(.22,1,.36,1)` (ease-out-quart)
- 지속시간: 0.3~0.6s
- Reveal 효과는 IntersectionObserver 기반, 1회성

---

## 4. 기술 스택

### 핵심
- **Pure Vanilla HTML / CSS / JavaScript** (프레임워크 없음)
- 단일 HTML 파일에 `<style>` + `<script>` 인라인
- 빌드 과정 없음 (no bundler, no transpilation)

### 의존성 (CDN)
- `cdn.jsdelivr.net` — jsPDF, html2canvas (invoice 페이지)
- `fonts.googleapis.com` / `fonts.gstatic.com` — Google Fonts

### 외부 API
- `api.upbit.com` — Crypto Heatmap
- `api.github.com` — GitHub Analyzer
- `image.pollinations.ai` — AI Drawing, MBTI Character
- `api.openai.com` — FinAI (BYO key)

---

## 5. 파일 구조

```
pyxora-site/
├── index.html              # 메인 홈페이지 (회사 소개)
├── brand-guide.html        # 브랜드 가이드 문서
├── projects/
│   ├── index.html          # 포트폴리오 허브 (27개 카드)
│   ├── tetris/             # 게임
│   ├── palette/            # 디자인 도구
│   ├── shader/             # WebGL 실험실
│   ├── finai/              # 재무 AI 챗봇
│   ├── crypto/             # Upbit 히트맵
│   ├── invoice/            # 세금계산서 생성기
│   ├── erp/                # ERP 대시보드 데모
│   ├── animal/             # 동물상 테스트
│   ├── drawing/            # AI 이미지 생성
│   ├── style/              # 이미지 스타일 변환
│   ├── naming/             # 브랜드 네이밍 AI
│   ├── mbti/               # MBTI 캐릭터 생성
│   ├── crm/                # 영업 CRM 데모
│   ├── hr/                 # 인사 대시보드 데모
│   ├── purchase/           # 구매 시스템 데모
│   ├── ledger/             # 복식부기 시뮬레이터
│   ├── inventory/          # 재고 관리 데모
│   ├── breakout/           # 네온 벽돌깨기
│   ├── 2048/               # 2048 게임
│   ├── kids-shapes/        # 유아 모양 맞추기
│   ├── kids-numbers/       # 유아 숫자 따라쓰기
│   ├── kids-animals/       # 유아 동물 소리
│   ├── world/              # 세계 지표 탐험
│   ├── subway/             # 서울 지하철 경로
│   ├── stock/              # 주식 캔들차트
│   ├── github/             # GitHub 분석
│   └── power/              # 한국 전력 모니터
├── _headers                # Cloudflare Pages 보안 헤더 + 캐시
├── _redirects              # www → apex 리다이렉트
├── sitemap.xml             # 33 URL
├── robots.txt              # AI 봇 차단 + 검색엔진 허용
├── og.png                  # Open Graph 이미지 (1200x630)
├── CLAUDE.md               # AI 에이전트 가이드 (이 파일과 별도)
├── SITE.md                 # 이 문서
├── README.md
├── package.json            # Playwright 테스트 의존성
├── test.mjs                # 기본 Playwright 테스트
├── audit.mjs               # 상세 SEO/a11y 감사
├── mobile-shot.mjs         # 모바일 스크린샷 유틸
├── gen-og.mjs              # OG 이미지 생성기
└── test-results/           # Playwright 테스트 결과
```

---

## 6. 포트폴리오 카테고리 (27개)

| 카테고리 | 개수 | 대표 작품 |
|---|---|---|
| 🎮 **게임 (Arcade)** | 3 | Tetris, Breakout, 2048 |
| 🤖 **AI 서비스** | 6 | FinAI, Drawing, Animal, Style, Naming, MBTI |
| 🏢 **Enterprise 데모** | 7 | ERP, Invoice, CRM, HR, Purchase, Ledger, Inventory |
| 📊 **데이터 시각화** | 6 | Crypto, World, Subway, Stock, GitHub, Power |
| 🛠 **크리에이티브 도구** | 2 | Palette, Shader |
| 👶 **어린이 교육** | 3 | Shapes, Numbers, Animals |

허브에서는 카테고리 탭 (`ALL / PLAY / AI / BUSINESS / DATA / TOOLS / KIDS`) 으로 필터링됩니다.

---

## 7. 배포 파이프라인

```
로컬 수정
  ↓
git add + git commit
  ↓
git push origin main
  ↓
GitHub: jaehyunseo/pyxora-site
  ↓
Cloudflare Pages webhook (자동 감지)
  ↓
빌드 (정적 파일이라 빌드 과정 없음, 그대로 업로드)
  ↓
Cloudflare CDN 전파 (약 1~2분)
  ↓
https://pyxora.app 반영
```

### 도메인
- **Primary**: `pyxora.app` (Cloudflare Registrar)
- **Redirect**: `www.pyxora.app` → `pyxora.app` (301, _redirects)
- **TLD**: `.app` = HSTS Preload 기본 적용
- **Nameservers**: Cloudflare (관리자만 확인)

### 이메일
- **Primary**: `hello@pyxora.app`
- **수신**: Cloudflare Email Routing → 개인 메일 포워딩 (관리자만 확인)
- **SPF**: `v=spf1 include:_spf.mx.cloudflare.net ~all`
- **DMARC**: `_dmarc.pyxora.app` TXT
- **발송**: Gmail "Send mail as" 설정됨

---

## 8. 보안 설정

### HTTP 헤더 (`_headers`)
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

### CSP (Content Security Policy)
```
default-src 'self';
script-src  'self' 'unsafe-inline'
            https://cdn.jsdelivr.net
            https://cdnjs.cloudflare.com
            https://static.cloudflareinsights.com;
style-src   'self' 'unsafe-inline'
            https://fonts.googleapis.com;
font-src    'self' https://fonts.gstatic.com;
img-src     'self' data: blob: https:;
connect-src 'self'
            https://api.upbit.com
            https://api.openai.com
            https://api.github.com
            https://image.pollinations.ai
            https://cdn.jsdelivr.net
            https://cloudflareinsights.com;
frame-ancestors 'self';
base-uri 'self';
form-action 'self';
```

### 캐시 정책
- `*.html`: `max-age=3600, must-revalidate` (1시간)
- `*.css`, `*.js`, `*.png`, `*.jpg`, `*.svg`, `*.woff2`: `max-age=31536000, immutable` (1년)
- `robots.txt`, `sitemap.xml`: `max-age=3600`

---

## 9. 성능 최적화 원칙

### 이미 적용된 것
- `content-visibility: auto` + `contain-intrinsic-size` (카드, 섹션)
- `backdrop-filter: blur()` 제거 (합성 레이어 폭발 방지)
- 무한 CSS 애니메이션 제거 (hero-orb, tech tree, visual-shader 등)
- `noise` 레이어 (`mix-blend-mode: overlay`) 제거
- 커스텀 커서 시스템 제거 (raf 루프 + 수백 리스너)
- `touch-action: manipulation` (iOS 300ms 탭 지연 제거)
- `-webkit-tap-highlight-color: transparent` (회색 하이라이트 제거)

### 금지 사항
- 무한 루프 애니메이션 (`animation: xxx infinite`)
- `filter: blur()` 큰 값 (> 20px) + 애니메이션 조합
- 전역 `mix-blend-mode` (composite layer 강제 생성)
- HTML5 `draggable="true"` (clip-path 쉐이프와 조합 시 ghost 이미지 깨짐)

---

## 10. 테스트 전략

### 로컬 Playwright 테스트
```bash
cd pyxora-site
npm install  # 최초 1회
node test.mjs       # 기본 3 viewport
node audit.mjs      # 상세 감사
node mobile-shot.mjs  # 모바일 스크린샷
```

### 배포 전 체크리스트
- [ ] 로컬 HTTP 서버에서 모든 프로젝트 로드 확인
- [ ] JS 콘솔 에러 0건 (외부 API CORS 제외)
- [ ] 데스크톱 + 모바일 viewport 모두 확인
- [ ] CSP 업데이트 시 `_headers` 파일 확인
- [ ] 새 프로젝트 추가 시 `sitemap.xml` 업데이트
- [ ] 새 프로젝트 추가 시 `projects/index.html` 허브에 카드 추가

---

## 11. SEO 및 메타

### robots.txt
- **허용**: Googlebot, Bingbot, 기타 일반 검색엔진
- **차단**: GPTBot, ClaudeBot, CCBot, anthropic-ai, Google-Extended (LLM 학습 데이터 제공 거부)

### 메타 태그 (모든 페이지)
- `<title>` 페이지별 고유
- `<meta name="description">`
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter Card (`summary_large_image`)

### 구조화 데이터
- 현재 없음 (추후 `Organization`, `WebSite` 스키마 추가 고려)

---

## 12. 알려진 이슈 / 향후 과제

### 미해결
- Crypto Heatmap — Upbit API 간헐적 CORS 오류 (알트코인 대량 배치 시)
- FinAI — 데모 모드 응답이 제한적 (8개 프리셋 키워드만 매칭)
- GitHub Analyzer — 비인증 API 요청 → rate limit 60/hour

### 개선 아이디어
- PWA 매니페스트 추가 (오프라인 지원)
- `/blog` 섹션 추가 (마크다운 기반)
- 다국어 지원 (한국어 / 영어 토글)
- 실제 Analytics (Plausible, Umami 등 프라이버시 친화적)
- OpenGraph 이미지 페이지별 자동 생성

---

## 13. 연락처

- **Email**: hello@pyxora.app
- **Website**: https://pyxora.app
- **GitHub**: https://github.com/jaehyunseo/pyxora-site

---

## 14. 라이선스 / 저작권

- **© MMXXVI Pyxora Studio** (2026)
- 전체 디자인/코드는 저작권 보유
- 각 포트폴리오 작품은 독립적으로 제작됨
- 사용된 폰트: Google Fonts (OFL 라이선스)
- 사용된 이모지: 시스템 폰트 (Apple/Windows/Google)

---

*이 문서는 프로젝트의 정체성과 현재 상태를 유지하기 위해 주기적으로 업데이트됩니다.*
