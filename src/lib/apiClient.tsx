
import axios, { type AxiosRequestConfig, type Method } from 'axios';

type PathParams = Record<string, string | number>;
type QueryParams = Record<string, any>;

export interface RequestOptions {
  pathParams?: PathParams;
  queryParams?: QueryParams;
  body?: any;
  headers?: AxiosRequestConfig['headers'];
}

const buildUrl = (url: string, pathParams: PathParams = {}, queryParams: QueryParams = {}): string => {
  // path params 치환
  let fullUrl = url;
  Object.keys(pathParams).forEach((key) => {
    fullUrl = fullUrl.replace(`{${key}}`, String(pathParams[key]));
  });

  // query params 추가
  // URLSearchParams 생성자는 string 값을 기대하므로 any로 캐스팅하거나 변환 필요
  const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
  if (queryString) {
    fullUrl += `?${queryString}`;
  }

  return fullUrl;
};

const request = async <T = any>(
  method: Method,
  url: string,
  { pathParams, queryParams, body, headers }: RequestOptions = {}
): Promise<T> => {
  try {
    const res = await axios({
      method,
      url: buildUrl(url, pathParams, queryParams),
      data: body,
      headers,
    });

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Method별 export
export const requestGet = <T = any>(url: string, options?: RequestOptions) => request<T>('GET', url, options);
export const requestPost = <T = any>(url: string, options?: RequestOptions) => request<T>('POST', url, options);
export const requestPatch = <T = any>(url: string, options?: RequestOptions) => request<T>('PATCH', url, options);
export const requestPut = <T = any>(url: string, options?: RequestOptions) => request<T>('PUT', url, options);
export const requestDelete = <T = any>(url: string, options?: RequestOptions) => request<T>('DELETE', url, options);
