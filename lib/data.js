export const mockData2 = {
  openapi: '3.0.3',
  info: {
    title: '사용자 관리 API',
    version: '1.2.0',
    description: '사용자 계정 관리를 위한 종합적인 API 서비스',
    contact: {
      name: 'ClaLink API 팀',
      email: 'api-support@clalink.com',
    },
  },

  paths: {
    '/users': {
      get: {
        operationId: 'getUsers',
        summary: '사용자 목록 조회',
        description: '등록된 사용자 목록을 페이지네이션으로 조회합니다',
        parameters: [
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 0, default: 0 },
          },
          {
            name: 'size',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
        ],
        responses: {
          200: {
            description: '사용자 목록 조회 성공',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    users: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        size: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: '인증 실패' },
          403: { description: '접근 권한 없음' },
        },
        security: [{ ApiKeyAuth: [] }],
        'x-api-key-required': true,
        'x-api-key-mappings': 3,
        'x-access-control': 'restricted',
        'x-request-validator': 'ALL',
        'x-api-keys': [
          {
            apiKeyId: 'KEY123456789',
            mappingId: 'MAP123456789',
            apiId: 'API123456789',
            methodId: 'MTH123456789',
            createdAt: '2024-01-10T10:00:00.000Z',
            createdBy: 'USR123456789',
          },
        ],
      },
      post: {
        operationId: 'createUser',
        summary: '사용자 생성',
        description: '새로운 사용자 계정을 생성합니다',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserRequest' },
            },
          },
        },
        responses: {
          201: {
            description: '사용자 생성 성공',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          400: { description: '잘못된 요청' },
          409: { description: '이미 존재하는 사용자' },
        },
        'x-api-key-required': true,
        'x-request-validator': 'BODY_ONLY',
        'x-api-keys': [
          {
            apiKeyId: 'KEY123456789',
            mappingId: 'MAP123456790',
            apiId: 'API123456789',
            methodId: 'MTH123456790',
          },
        ],
      },
      'x-cors-policy': {
        allowOrigins: ['https://app.clalink.com', 'https://admin.clalink.com'],
        allowMethods: ['GET', 'POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
        exposeHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
        maxAge: 86400,
        allowCredentials: true,
      },
    },
    '/users/{userId}': {
      get: {
        operationId: 'getUserById',
        summary: '사용자 상세 조회',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string', pattern: '^[a-zA-Z0-9]{12}$' },
          },
        ],
        responses: {
          200: {
            description: '사용자 조회 성공',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          404: { description: '사용자를 찾을 수 없음' },
        },
        'x-api-key-required': true,
        'x-request-validator': 'PARAMS_ONLY',
        'x-api-keys': [
          {
            apiKeyId: 'KEY123456789',
            mappingId: 'MAP456789123',
            methodId: 'MTH456789123',
          },
        ],
      },
      'x-cors-policy': {
        allowOrigins: ['https://app.clalink.com'],
        allowMethods: ['GET', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400,
        allowCredentials: true,
      },
    },
  },
  components: {
    schemas: {
      User: { $ref: '#/models/User' },
      CreateUserRequest: { $ref: '#/models/CreateUserRequest' },
      ErrorResponse: { $ref: '#/models/ErrorResponse' },
    },
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API Gateway에서 인증 서버를 통해 검증하는 API Key',
      },
    },
  },
  security: [{ ApiKeyAuth: [] }],
  tags: [
    { name: 'Users', description: '사용자 계정 관리' },
    { name: 'Profile', description: '사용자 프로필 관리' },
  ],
};

export const requestHeaderList = [
  {
    id: 1,
    label: 'Accept',
    value: 'Accept',
  },
  {
    id: 2,
    label: 'Accept-Charset',
    value: 'Accept-Charset',
  },
  {
    id: 3,
    label: 'Accept-Encoding',
    value: 'Accept-Encoding',
  },
  {
    id: 4,
    label: 'Accept-Language',
    value: 'Accept-Language',
  },
  {
    id: 5,
    label: 'Access-Control-Request-Headers',
    value: 'Access-Control-Request-Headers',
  },
  {
    id: 6,
    label: 'Access-Control-Request-Method',
    value: 'Access-Control-Request-Method',
  },
  {
    id: 7,
    label: 'Authorization',
    value: 'Authorization',
  },
  {
    id: 8,
    label: 'Cache-Control',
    value: 'Cache-Control',
  },
  {
    id: 9,
    label: 'Content-MD5',
    value: 'Content-MD5',
  },
  {
    id: 10,
    label: 'Content-Length',
    value: 'Content-Length',
  },
  {
    id: 11,
    label: 'Content-Transfer-Encoding',
    value: 'Content-Transfer-Encoding',
  },
  {
    id: 12,
    label: 'Content-Type',
    value: 'Content-Type',
  },
  {
    id: 13,
    label: 'Cookie',
    value: 'Cookie',
  },
  {
    id: 14,
    label: 'Cookie 2',
    value: 'Cookie 2',
  },
  {
    id: 15,
    label: 'Date',
    value: 'Date',
  },
  {
    id: 16,
    label: 'Expect',
    value: 'Expect',
  },
  {
    id: 17,
    label: 'From',
    value: 'From',
  },
  {
    id: 18,
    label: 'Host',
    value: 'Host',
  },
  {
    id: 19,
    label: 'If-Match',
    value: 'If-Match',
  },
  {
    id: 20,
    label: 'If-Modified-Since',
    value: 'If-Modified-Since',
  },
  {
    id: 21,
    label: 'If-None-Match',
    value: 'If-None-Match',
  },

  {
    id: 22,
    label: 'If-Range',
    value: 'If-Range',
  },
  {
    id: 23,
    label: 'If-Unmodified-Since',
    value: 'If-Unmodified-Since',
  },
  {
    id: 24,
    label: 'Keep-Alive',
    value: 'Keep-Alive',
  },
  {
    id: 25,
    label: 'Max-Forwards',
    value: 'Max-Forwards',
  },
  {
    id: 26,
    label: 'Origin',
    value: 'Origin',
  },
  {
    id: 27,
    label: 'Pragma',
    value: 'Pragma',
  },
  {
    id: 28,
    label: 'Proxy-Authorization',
    value: 'Proxy-Authorization',
  },
  {
    id: 29,
    label: 'Range',
    value: 'Range',
  },
  {
    id: 30,
    label: 'Referer',
    value: 'Referer',
  },
  {
    id: 31,
    label: 'TE',
    value: 'TE',
  },
  {
    id: 32,
    label: 'Trailer',
    value: 'Trailer',
  },
  {
    id: 33,
    label: 'Transfer-Encoding',
    value: 'Transfer-Encoding',
  },
  {
    id: 34,
    label: 'Upgrade',
    value: 'Upgrade',
  },
  {
    id: 35,
    label: 'User-Agent',
    value: 'User-Agent',
  },
  {
    id: 36,
    label: 'Via',
    value: 'Via',
  },
  {
    id: 37,
    label: 'Warning',
    value: 'Warning',
  },
  {
    id: 38,
    label: 'X-Requested-With',
    value: 'X-Requested-With',
  },
  {
    id: 39,
    label: 'X-Do-Not-Track',
    value: 'X-Do-Not-Track',
  },
  {
    id: 40,
    label: 'DNT',
    value: 'DNT',
  },
  {
    id: 41,
    label: 'x-api-key',
    value: 'x-api-key',
  },
  {
    id: 42,
    label: 'x-mock-math-request-body',
    labvalueel: 'x-mock-math-request-body',
  },
  {
    id: 43,
    label: 'x-mock-match-request-headers',
    value: 'x-mock-match-request-headers',
  },
  {
    id: 44,
    label: 'x-mock-response-id',
    value: 'x-mock-response-id',
  },
  {
    id: 45,
    label: 'x-mock-response-name',
    value: 'x-mock-response-name',
  },
  {
    id: 46,
    label: 'x-mock-response-code',
    value: 'x-mock-response-code',
  },
  {
    id: 47,
    label: 'x-mock-response-delay',
    value: 'x-mock-response-delay',
  },
  {
    id: 48,
    label: 'Connection',
    value: 'Connection',
  },
];

export const exampleMethodList = [
  {
    id: 1,
    label: 'GET',
    value: 'GET',
  },
  {
    id: 2,
    label: 'POST',
    value: 'POST',
  },
  {
    id: 3,
    label: 'PUT',
    value: 'PUT',
  },
  {
    id: 4,
    label: 'DELETE',
    value: 'DELETE',
  },
  {
    id: 5,
    label: 'PATCH',
    value: 'PATCH',
  },
  {
    id: 6,
    label: 'OPTIONS',
    value: 'OPTIONS',
  },
];

export const checkerOptionList = [
  {
    id: 1,
    label: '없음',
    value: '없음',
  },
  {
    id: 2,
    label: '본문 검증',
    value: '본문 검증',
  },
  {
    id: 3,
    label: '헤더 검증',
    value: '헤더 검증',
  },
  {
    id: 4,
    label: '파라미터 검증',
    value: '파라미터 검증',
  },
  {
    id: 5,
    label: '본문 및 파라미터 검증',
    value: '본문 및 파라미터 검증',
  },
  {
    id: 6,
    label: '전체 검증',
    value: '전체 검증',
  },
];
