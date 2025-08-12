// apiClient.js
import axios from 'axios';

const buildUrl = (url, pathParams = {}, queryParams = {}) => {
  // path params 치환
  let fullUrl = url;
  Object.keys(pathParams).forEach((key) => {
    fullUrl = fullUrl.replace(`{${key}}`, pathParams[key]);
  });

  // query params 추가
  const queryString = new URLSearchParams(queryParams).toString();
  if (queryString) {
    fullUrl += `?${queryString}`;
  }

  return fullUrl;
};

const request = async (method, url, { pathParams, queryParams, body } = {}) => {
  try {
    const res = await axios({
      method,
      url: buildUrl(`${url}`, pathParams, queryParams),
      data: body,
    });

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Method별 export
export const requestGet = (url, options) => request('GET', url, options);
export const requestPost = (url, options) => request('POST', url, options);
export const requestPatch = (url, options) => request('PATCH', url, options);
export const requestPut = (url, options) => request('PUT', url, options);
export const requestDelete = (url, options) => request('DELETE', url, options);
