# benhuhs.log

https://benhuhs.github.io

테마 없이 직접 만든 Jekyll 블로그. GitHub Pages 기본 빌드로 배포.

## 글 쓰기

1. `_drafts/template.md`를 복사
2. `_posts/2026-11-21-제목.md` 형식으로 저장
3. 머리말의 `category`를 아래 slug 중 하나로 지정

| slug | 카테고리 |
| --- | --- |
| dev | 개발 |
| ctf | CTF / Wargame |
| bugbounty | Bug Bounty |
| techdocs | 블로그 / 기술문서 |
| paper | 논문 / 컨퍼런스 |
| contest | 공모전 / 자격증 |

## 구조

- `_data/categories.yml` 카테고리 이름·설명
- `_layouts/` 홈, 카테고리, 글, 일반 페이지 틀
- `assets/css/style.css` 색상·글꼴은 맨 위 `:root` 변수에서 변경
- `about.html` 소개 페이지
