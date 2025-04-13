import axios from "axios";
import router from "@/router";

const BASE_URL = "http://localhost:8080";

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

// Response Interceptor - 토큰 만료 처리
tbAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 액세스 토큰 만료 && 재시도하지 않은 요청
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 리프레시 토큰으로 새 액세스 토큰 발급
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const response = await tbAxios.post("/auth/refresh", {
                    refreshToken
                });

                const { accessToken } = response.data;

                // 새 토큰 저장
                localStorage.setItem("accessToken", accessToken);
                
                // 원래 요청의 헤더 업데이트
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                
                // 원래 요청 재시도
                return tbAxios(originalRequest);
            } catch (refreshError) {
                // 리프레시 실패 시 로그아웃 처리
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                router.push("/login");
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);