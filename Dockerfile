# ========================================
# Stage 1: Vue3 빌드 스테이지
# ========================================
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일만 먼저 복사 (레이어 캐시 최적화)
COPY package.json package-lock.json ./

# 프로덕션 및 개발 의존성 모두 설치 (빌드에 필요)
RUN npm ci --only=production=false && \
    npm cache clean --force

# 소스 코드 복사
COPY . .

# Vue3 프로젝트 빌드 실행
RUN npm run build

# 빌드 결과물 확인 (디버깅용)
RUN ls -la /app/dist

# ========================================
# Stage 2: nginx 프로덕션 스테이지
# ========================================
FROM nginx:alpine

# nginx 기본 설정 백업 제거 (선택사항)
# RUN rm /etc/nginx/conf.d/default.conf

# 빌드 스테이지에서 생성된 Vue3 빌드 산출물(dist) 복사
COPY --from=build /app/dist /usr/share/nginx/html

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/templates/default.conf.template

# envsubst 설치 (환경 변수 치환용)
RUN apk add --no-cache gettext

# 환경 변수 기본값 설정 (컨테이너 실행 시 오버라이드 가능)
ENV BACKEND_URL=http://localhost:8080
ENV NGINX_HOST=localhost
ENV NGINX_PORT=80

# 포트 노출
EXPOSE 80

# nginx 설정 파일에 환경 변수 적용 후 nginx 실행
CMD envsubst '$$BACKEND_URL $$NGINX_HOST $$NGINX_PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;'
