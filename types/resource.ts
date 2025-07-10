export interface Resource {
  id: string;
  path: string;
  name: string;
  corsEnabled: boolean;
  corsSettings?: any;
  children?: Resource[];
  methods: Method[];
}

export interface Method {
  id: string;
  type: string;
  permissions: string;
  apiKey: string;
  resourcePath: string;
  endpointUrl: string;
  summary: string;
  description: string;
  parameters: any[];
  requestBody: any;
  responses: Record<string, any>;
  security: any;
  requestValidator?: string;
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
  allowHeaders: string;
  allowOrigin: string;
  exposeHeaders: string;
  maxAge: string;
  allowCredentials: boolean;
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
