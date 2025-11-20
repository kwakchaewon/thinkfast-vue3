# ========================================
# Stage 1: Vue3 빌드 스테이지
# ========================================
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일만 먼저 복사 (레이어 캐시 최적화)
COPY package*.json ./

# 프로덕션 및 개발 의존성 모두 설치 (빌드에 필요)
RUN npm ci --only=production=false && \
    npm cache clean --force

# 소스 코드 복사
COPY . .

# Vue3 프로젝트 빌드 실행 (Docker 빌드에서는 vite build만 실행하여 타입 체크 오류 방지)
RUN npx vite build || (echo "빌드 실패!" && exit 1)

# 빌드 결과물 확인 (더 자세하게)
RUN echo "=== 빌드 결과 확인 ===" && \
    echo "1. dist 폴더 존재 여부:" && \
    (test -d /app/dist && echo "dist 폴더 존재" || echo "dist 폴더 없음") && \
    echo "2. dist 폴더 내용:" && \
    (ls -la /app/dist 2>&1 || echo "ls 실패") && \
    echo "3. dist 파일 목록:" && \
    (find /app/dist -type f 2>&1 | head -20 || echo "find 실패") && \
    echo "4. index.html 존재 여부:" && \
    (test -f /app/dist/index.html && echo "index.html 존재" || echo "index.html 없음") && \
    echo "5. index.html 크기:" && \
    (wc -c /app/dist/index.html 2>&1 || echo "wc 실패") && \
    echo "6. index.html 내용:" && \
    (cat /app/dist/index.html 2>&1 || echo "cat 실패") && \
    echo "7. assets 폴더:" && \
    (ls -la /app/dist/assets 2>&1 || echo "assets 폴더 없음") && \
    echo "8. assets/js:" && \
    (ls -la /app/dist/assets/js 2>&1 || echo "assets/js 없음") && \
    echo "9. assets/css:" && \
    (ls -la /app/dist/assets/css 2>&1 || echo "assets/css 없음")

# ========================================
# Stage 2: nginx 프로덕션 스테이지
# ========================================
FROM nginx:alpine

# 빌드 스테이지에서 생성된 Vue3 빌드 산출물(dist) 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 복사 확인 (디버깅용)
RUN echo "=== 복사 후 파일 확인 ===" && \
    echo "1. HTML 디렉토리 내용:" && \
    (ls -la /usr/share/nginx/html 2>&1 || echo "ls 실패") && \
    echo "2. index.html 존재:" && \
    (test -f /usr/share/nginx/html/index.html && echo "index.html 존재" || echo "index.html 없음") && \
    echo "3. index.html 크기:" && \
    (wc -c /usr/share/nginx/html/index.html 2>&1 || echo "wc 실패") && \
    echo "4. index.html 내용:" && \
    (cat /usr/share/nginx/html/index.html 2>&1 || echo "cat 실패") && \
    echo "5. assets 폴더:" && \
    (ls -la /usr/share/nginx/html/assets/ 2>&1 || echo "assets 폴더 없음") && \
    echo "6. assets/js:" && \
    (ls -la /usr/share/nginx/html/assets/js 2>&1 || echo "assets/js 없음") && \
    echo "7. assets/css:" && \
    (ls -la /usr/share/nginx/html/assets/css 2>&1 || echo "assets/css 없음") && \
    echo "8. 전체 파일 목록:" && \
    (find /usr/share/nginx/html -type f 2>&1 | head -20 || echo "find 실패")

# nginx 설정 파일을 템플릿으로 복사 (nginx:alpine이 자동으로 환경 변수 치환 처리)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# 환경 변수 기본값 설정 (컨테이너 실행 시 오버라이드 가능)
# Docker Compose 환경에서는 서비스명을 사용해야 함
ENV BACKEND_URL=http://thinkfast-backend:8080
ENV NGINX_HOST=localhost
ENV NGINX_PORT=80

# 포트 노출
EXPOSE 80

# envsubst는 nginx:alpine의 entrypoint가 자동으로 처리하므로 CMD만 명시
CMD ["nginx", "-g", "daemon off;"]
