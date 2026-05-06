import axios from 'axios'

// 일반 API 요청용 (인터셉터 부착 예정)
export const axiosInstance = axios.create({
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
})

// 토큰 갱신 전용 (인터셉터 없음)
export const axiosAuth = axios.create({
    timeout: 10000,
})