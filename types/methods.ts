export interface QueryParameter {
  id?: string | number;
  name: string;
  required: boolean;
}

export interface Header {
  id?: string | number;
  name: string;
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
  id?: string;
  modelName: string;
  modelId: string;
  type: string;
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
  modelName: string;
}
