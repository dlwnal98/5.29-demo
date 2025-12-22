export interface Resource {
  id: number | string;
  path: string;
  name: string;
  description: string;
  children?: Resource[];
  methods: Method[];
  cors?: {
    allowMethods?: string[];
    allowHeaders?: string[];
    allowOrigins?: string;
    exposeHeaders?: string[];
    maxAge?: string;
    allowCredentials?: boolean;
    createdAt: string;
    policyId: string;
    resourceId: string;
    updatedAt: string;
  };
}

export interface Method {
  id: string | number;
  type: string;
  resourcePath: string;
  info: {};
}

export interface Stage {
  id: string;
  name: string;
  description: string;
}

export interface ResponseHeader {
  id: string;
  name: string;
  value: string;
}

export interface ResponseBody {
  id: string;
  contentType: string;
  model: string;
}

export interface TestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  responseTime: number;
}

export interface CorsSettings {
  allowMethods: string[];
  allowHeaders?: string[];
  allowOrigin?: string[];
  exposeHeaders?: string[];
  maxAge?: string;
  allowCredentials?: boolean;
}

export interface QueryParameter {
  id: string;
  name: string;
  description: string;
  type: string;
  required: boolean;
  cacheKey: boolean;
}

export interface RequestHeader {
  id: string;
  name: string;
  description: string;
  type: string;
  required: boolean;
}

export interface RequestBodyModel {
  id: string;
  contentType: string;
  modelName: string;
  modelId: string;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  schema: string;
}

export interface MethodResponse {
  id: string;
  statusCode: string;
  headers: ResponseHeader[];
  bodies: ResponseBody[];
}
