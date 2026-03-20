
// 메소드 별 색상 지정
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export interface ApiResource {
  id: string;
  path: string;
  name: string;
  children?: ApiResource[];
  methods: ApiMethod[];
  stageId?: string;
  deploymentId?: string;
  description?: string;
}

export interface ApiMethod {
  id: string;
  type: HttpMethod;
  path: string;
  endpointUrl: string;
  description: string;
  info?: {
    summary?: string;
  };
}

export interface SelectedWholeStageInfo {
  resource: Partial<ApiResource>;
  type: "stage" | "resource";
}

export interface SelectedMethod {
  resourceId: string;
  resourcePath: string;
  method: ApiMethod;
  url: string;
}
