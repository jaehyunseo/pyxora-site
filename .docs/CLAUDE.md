# CLAUDE.md — Pyxora Site 프로젝트 가이드

> Claude Code / AI 에이전트가 이 프로젝트를 빠르게 파악하기 위한 문서.
> 상세 브랜드/스펙은 **`.docs/SITE.md`** 참고.
>
> ⚠️ **보안**: 이 파일과 `.docs/` 폴더 내용은 **로컬 전용**입니다.
> Cloudflare Pages가 dotfolder를 배포에서 자동 제외하므로 pyxora.app/.docs/ 로
> 접근되지 않습니다. 이 파일에 민감한 정보(API 키, 비밀번호 등)를 절대 쓰지 마세요.

## 프로젝트 개요

**Pyxora Studio** 회사 소개 사이트 + **27개 포트폴리오**.
- 라이브: https://pyxora.app
- 레포: `github.com/jaehyunseo/pyxora-site`
- 배포: GitHub push → Cloudflare Pages 자동 반영 (1~2분)

## 핵심 규칙

### 1. 언어
- **모든 답변은 한글**
- 코드 주석은 한글 우선 (영어도 허용)
- 커밋 메시지는 영어 (기술 용어 명확성)

### 2. 기술 스택 (중요)
- **Vanilla HTML + CSS + JavaScript만** (프레임워크 금지)
- **빌드 과정 없음** — 파일 수정 후 즉시 배포
- 각 프로젝트는 **단일 `index.html` 파일** (`<style>` + `<script>` 인라인)
- CDN 의존성은 최소 (jsPDF, html2canvas만)
- Node.js는 테스트 스크립트(`test.mjs`)에서만 사용

### 3. 파일 구조
```
pyxora-site/
├── index.html                # 메인 (회사 소개)
├── brand-guide.html          # 브랜드 가이드
├── projects/
│   ├── index.html            # 허브 (27개 카드 + 카테고리 탭)
│   └── {project-name}/
│       └── index.html        # 각 프로젝트 단일 파일
├── _headers                  # CSP + 보안 헤더 + 캐시
├── _redirects                # www → apex
├── sitemap.xml               # 33 URL
├── robots.txt
├── og.png
├── .docs/                    # 내부 문서 (웹 비공개)
│   ├── SITE.md               # 상세 스펙 문서
│   └── CLAUDE.md             # 이 파일
└── test.mjs / audit.mjs      # Playwright 테스트 (웹 비공개)
```

### 4. 작업 원칙
1. **신규 프로젝트 추가 시**:
   - `projects/{name}/index.html` 생성 (단일 파일)
   - `projects/index.html` 허브에 카드 추가 (SITE.md § 6 참고)
   - `sitemap.xml` 에 URL 추가
   - 카테고리 중 하나 지정 (`play` / `ai` / `biz` / `data` / `tool` / `kids`)

2. **디자인 시스템 준수** (SITE.md § 3):
   - 다크 테마 기본 (`--bg: #06060f`)
   - 골드 악센트 (`--pyx: #fbbf24`)
   - 폰트: Space Grotesk + Pretendard + JetBrains Mono
   - `border-radius: 16~32px`

3. **성능 원칙** (SITE.md § 9):
   - `backdrop-filter: blur()` 금지 (합성 레이어 폭발)
   - 무한 루프 CSS 애니메이션 금지
   - `mix-blend-mode` 전역 사용 금지
   - `content-visibility: auto` 활용
   - `touch-action: manipulation` 모든 버튼/링크에 적용

4. **iOS 호환**:
   - `-webkit-user-select`, `-webkit-tap-highlight-color` 명시
   - HTML5 `draggable="true"` 대신 **pointer events** 사용 (clip-path 쉐이프와 호환)
   - `touch-action: none` (게임 캔버스 등 스크롤 차단 필요 시)

### 5. CSP (수정 시 주의)
`_headers` 파일의 `Content-Security-Policy`:
- 새 외부 도메인 추가 시 해당 directive 업데이트 필수
  - 스크립트 → `script-src`
  - API → `connect-src`
  - 이미지 → `img-src` (현재 `https:` 전체 허용)
  - 폰트 → `font-src`
- Cloudflare Analytics는 이미 허용됨 (`static.cloudflareinsights.com`)

### 6. 테스트
```bash
# 로컬 정적 서버 (Python)
python -m http.server 8080

# 또는 Node.js
npx http-server -p 8080

# Playwright 기본 테스트
node test.mjs

# 상세 감사
node audit.mjs
```

배포 전 체크:
- [ ] 새 페이지 콘솔 에러 0건
- [ ] 데스크톱 + 모바일 (iPhone 13 viewport) 모두 정상
- [ ] 허브 (`projects/index.html`) 에 카드 추가
- [ ] sitemap.xml 업데이트

### 7. 커밋 / 배포
```bash
git add -A
git commit -m "concise english message"
git push origin main
# → Cloudflare Pages가 자동으로 1~2분 내 배포
```

## 보안 규칙

- `.env` 파일 없음 (정적 사이트)
- API 키는 **절대 커밋 금지** (BYO 방식 권장: FinAI처럼 localStorage에 사용자 키 저장)
- `_headers` 의 CSP는 엄격하게 유지 — 신규 CDN 추가 시 최소 권한 원칙
- 프로덕션 도메인 (`pyxora.app`) 에 직접 push 하는 셈이니 신중히 작업

## 주의 사항

### 절대 하면 안 되는 것
- ❌ React/Vue/Next.js 등 프레임워크 도입 (기존 철학 위배)
- ❌ 빌드 도구 (Webpack, Vite 등) 추가
- ❌ `cursor: none` + 커스텀 커서 시스템 (과거 성능 이슈로 제거됨)
- ❌ `body::after` 에 `mix-blend-mode: overlay` 노이즈 레이어
- ❌ 카드/컴포넌트에 무한 CSS 애니메이션 (GPU 부담)
- ❌ HTML5 `draggable="true"` + `clip-path` 조합 (ghost 이미지 깨짐)

### 자주 놓치는 것
- 새 프로젝트 추가 후 **허브 카드 빼먹기** → 접근 불가
- CSP 업데이트 안 하고 **외부 API 호출** → 프로덕션에서만 차단
- Playwright 테스트는 통과하지만 **실제 iOS Safari는 다름** (touch-action 필수)

## 빠른 참조

### 프로젝트 목록 (27개)
- **Games**: tetris, breakout, 2048
- **AI**: finai, drawing, animal, style, naming, mbti
- **Enterprise**: erp, invoice, crm, hr, purchase, ledger, inventory
- **Data**: crypto, world, subway, stock, github, power
- **Tools**: palette, shader
- **Kids**: kids-shapes, kids-numbers, kids-animals

### 주요 경로
- 메인 홈: `/` → `index.html`
- 허브: `/projects/` → `projects/index.html`
- 개별 프로젝트: `/projects/{name}/`
- 브랜드 가이드: `/brand-guide.html`

### 외부 API / 의존성
| 사용처 | 도메인 | 직접 사용 or CSP |
|---|---|---|
| Upbit 시세 | `api.upbit.com` | Crypto Heatmap |
| OpenAI (BYO) | `api.openai.com` | FinAI |
| GitHub | `api.github.com` | GitHub Analyzer |
| Pollinations (무료 AI) | `image.pollinations.ai` | Drawing, MBTI |
| jsPDF / html2canvas | `cdn.jsdelivr.net` | Invoice |
| Google Fonts | `fonts.googleapis.com`, `fonts.gstatic.com` | 전체 |

## 컨텍스트 가져오기

세션 시작 시 다음 순서로 파일을 참고하세요:

1. **`CLAUDE.md`** (이 파일) — 프로젝트 규칙과 제약
2. **`SITE.md`** — 브랜드 정체성, 디자인 시스템, 상세 스펙
3. **`projects/index.html`** — 현재 포트폴리오 전체 구조
4. **작업 대상 파일** — 구체적인 수정이 필요한 파일만

전체 레포를 한 번에 읽을 필요는 없음.
27개 프로젝트는 완전 독립된 단일 HTML 파일이라 개별 수정 가능.

## 질문이 필요할 때

요구사항이 **모호하면 반드시 먼저 질문**:
- "무엇이 문제인지" 명시 안 됨 → 어느 페이지 / 어느 기능 질문
- UI/UX 방향 미지정 → 디자인 옵션 질문
- "개선해줘" 만 있음 → 범위 질문

모호한 요청을 스스로 해석해서 바로 코드 작성 금지.
