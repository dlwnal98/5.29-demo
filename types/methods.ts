export interface QueryParameter {
  id?: string;
  name: string;
  type: string;

  required: boolean;
}

export interface Header {
  id?: string;

  name: string;
  type: string;

  required: boolean;
}

export interface FormData {
  id: string;
  name: string;
  description: string;
  type: string;
  isArray: boolean;
  required: boolean;
}

export interface BodyModel {
  id: string;
  name: string;
  description: string;
  model: string;
}

export interface MockHeader {
  id: string;
  name: string;
  value: string;
}

export interface ApiKey {
  id: string;
  name: string;
  description: string;
  value: string;
}

export interface Model {
  modelId: string;
  apiId: string;
  modelName: string;
  modelType: string;
  description: string;
  enabled: boolean;
  createdAt: string;
  createdBy: string;
}
