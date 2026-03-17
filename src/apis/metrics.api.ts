import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/libs/request';

export interface AggregatesProps {
    tenantId: string;
    apiId?: string;
    stageId?: string;
    startTime: string;
    endTime: string;
    granularity: "MINUTE" | "HOURLY" | "DAILY" | "MONTHLY";
}

// 집계 메트릭스
export const getAggregatesData = async (data: AggregatesProps) => {
    const res = await requestGet(`/api/v1/metrics/aggregates?tenantId=${data.tenantId}&apiId=${data.apiId}&stageId=${data.stageId}&startTime=${data.startTime}&endTime=${data.endTime}&granularity=${data.granularity || 'HOURLY'}`);

    return res;
};

export interface ErrorRatesProps {
    tenantId: string;
    apiId?: string;
    stageId?: string;
    startTime?: string;
    endTime?: string;
}

// 에러율
export const getErrorRatesData = async (data: ErrorRatesProps) => {
    const res = await requestGet(`/api/v1/metrics/error-rates?tenantId=${data.tenantId}&apiId=${data.apiId}&stageId=${data.stageId}&startTime=${data.startTime}&endTime=${data.endTime}`);

    return res;
};

export interface MetricsHistoryProps {
    tenantId: string;
    apiId?: string;
    stageId?: string;
    startTime?: string;
    endTime?: string;
    page?: number;
    size?: number;
}

// 메트릭스 히스토리
export const getMetricsHistoryData = async (data: MetricsHistoryProps) => {
    const res = await requestGet(`/api/v1/metrics/history?tenantId=${data.tenantId}&apiId=${data.apiId}&stageId=${data.stageId}&startTime=${data.startTime}&endTime=${data.endTime}&page=${data.page || '0'}&size=${data.size || '20'}`);

    return res;
};

export interface RealTimeMetricsProps {
    tenantId: string;
    apiId?: string;
    stageId?: string;
    minutes?: number;
    granularity?: "MINUTE" | "HOURLY" | "DAILY" | "MONTHLY";
}

// 실시간 메트릭스
export const getRealTimeMetricsData = async (data: RealTimeMetricsProps) => {
    const res = await requestGet(`/api/v1/metrics/realtime?tenantId=${data.tenantId}&apiId=${data.apiId}&stageId=${data.stageId}&minutes=${data.minutes || '5'}&granularity=${data.granularity || 'MINUTE'}`);

    return res;
};


export interface SummaryMetricsProps {
    tenantId: string;
    apiId?: string;
    stageId?: string;
}

// 메트릭스 요약
export const getSummaryMetricsData = async (data: SummaryMetricsProps) => {
    const res = await requestGet(`/api/v1/metrics/summary?tenantId=${data.tenantId}&apiId=${data.apiId}&stageId=${data.stageId}`);

    return res;
};


export interface TopApisProps {
    tenantId: string;
    limit?: number;
    stageId?: string;
    startTime: string;
    endTime: string;
}

// 상위 API
export const getTopApisData = async (data: TopApisProps) => {
    const res = await requestGet(`/api/v1/metrics/top-apis?tenantId=${data.tenantId}&limit=${data.limit}&stageId=${data.stageId}&startTime=${data.startTime}&endTime=${data.endTime}`);

    return res;
};


export interface AggregatesProps {
    tenantId: string;
    apiId?: string;
    stageId?: string;
    startTime: string;
    endTime: string;
    granularity: "MINUTE" | "HOURLY" | "DAILY" | "MONTHLY";
}

// 집계 메트릭스
export const getAggregatesData = async (data: AggregatesProps) => {
    const res = await requestGet(`/api/v1/metrics/aggregates?tenantId=${data.tenantId}&apiId=${data.apiId}&stageId=${data.stageId}&startTime=${data.startTime}&endTime=${data.endTime}&granularity=${data.granularity}`);

    return res;
};


export interface AggregatesProps {
    tenantId: string;
    apiId?: string;
    stageId?: string;
    startTime: string;
    endTime: string;
    granularity: "MINUTE" | "HOURLY" | "DAILY" | "MONTHLY";
}

// 집계 메트릭스
export const getAggregatesData = async (data: AggregatesProps) => {
    const res = await requestGet(`/api/v1/metrics/aggregates?tenantId=${data.tenantId}&apiId=${data.apiId}&stageId=${data.stageId}&startTime=${data.startTime}&endTime=${data.endTime}&granularity=${data.granularity}`);

    return res;
};


export interface AggregatesProps {
    tenantId: string;
    apiId?: string;
    stageId?: string;
    startTime: string;
    endTime: string;
    granularity: "MINUTE" | "HOURLY" | "DAILY" | "MONTHLY";
}

// 집계 메트릭스
export const getAggregatesData = async (data: AggregatesProps) => {
    const res = await requestGet(`/api/v1/metrics/aggregates?tenantId=${data.tenantId}&apiId=${data.apiId}&stageId=${data.stageId}&startTime=${data.startTime}&endTime=${data.endTime}&granularity=${data.granularity}`);

    return res;
};
