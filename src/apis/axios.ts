import axios from "axios";
import router from "@/router";
import store from "@/store";

// 환경에 따라 동적으로 API URL 설정
// 프로덕션: /api 경로 사용 (nginx가 /api로 프록시)
// 개발 환경: localhost 사용
const BASE_URL = import.meta.env.PROD 
  ? '/api'  // 프로덕션: /api 경로 (nginx 프록시 사용)
  : 'http://localhost:8080';  // 개발 환경

export const tbAxios = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        Accept: 'application/json',
    },
});

// Request Interceptor - 액세스 토큰 자동 설정
tbAxios.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 리프레시 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
// 갱신 대기 중인 요청들을 저장할 배열
let refreshSubscribers: ((token: string) => void)[] = [];

// 토큰 갱신 후 대기 중인 요청들을 처리하는 함수
const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
};

// 토큰 갱신 중일 때 요청을 큐에 추가하는 함수
const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

// Response Interceptor - 토큰 만료 처리
tbAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 액세스 토큰 만료 && 재시도하지 않은 요청
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // 이미 토큰 갱신 중이면 새로운 토큰을 기다림
                return new Promise(resolve => {
                    addRefreshSubscriber(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(tbAxios(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                console.log("refreshToken", refreshToken);
                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const response = await tbAxios.post("/auth/refresh", 
                    { refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const accessToken = response.data.data.accessToken;
                const newRefreshToken = response.data.data.refreshToken;
                const realUsername = response.data.data.realUsername;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);
                if (realUsername) {
                    localStorage.setItem("realUsername", realUsername);
                }

                // Store 업데이트
                store.dispatch('setUser', {
                    username: localStorage.getItem('username') || '',
                    realUsername: realUsername,
                    accessToken: accessToken,
                    refreshToken: newRefreshToken,
                    role: localStorage.getItem('role') || ''
                });

                // 대기 중인 모든 요청에 새 토큰 적용
                onRefreshed(accessToken);
                
                // 원래 요청 재시도
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return tbAxios(originalRequest);
            } catch (refreshError) {
                // 리프레시 실패 시 로그아웃 처리
                localStorage.removeItem("username");
                localStorage.removeItem("realUsername");
                localStorage.removeItem("role");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                router.push("/login");
                store.dispatch("handleTokenExpiration");
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default tbAxios;