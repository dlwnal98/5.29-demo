export const sampleApiData = `
  _id: 'aBcD1234xYz',
  apiName: 'User Management API',
  version: 'v1',
  specType: 'openapi',
  spec: {
    openapi: '3.0.1',
    info: {
      title: 'User Management API',
      version: 'v1',
      description: '유저 관리 시스템의 API',
    },
    servers: [
      { url: 'https://api.example.com/v1', description: 'Production' },
      { url: 'https://staging-api.example.com/v1', description: 'Staging' },
    ],
    paths: {
      '/users': {
        get: {
          summary: '전체 유저 목록 조회',
          description: '등록된 전체 유저를 페이지네이션 방식으로 조회합니다.',
          tags: ['User'],
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: '페이지 번호',
              required: false,
              schema: { type: 'integer', default: 1 },
            },
            {
              name: 'size',
              in: 'query',
              description: '페이지 크기',
              required: false,
              schema: { type: 'integer', default: 20 },
            },
          ],
          responses: {
            '200': {
              description: '유저 목록 반환',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UserList' },
                },
              },
            },
          },
          security: [{ BearerAuth: [] }],
        },
        post: {
          summary: '유저 등록',
          description: '새로운 유저를 생성합니다.',
          tags: ['User'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserCreateRequest' },
              },
            },
          },
          responses: {
            '201': {
              description: '유저 생성 성공',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
          security: [{ BearerAuth: [] }],
        },
      },
      '/users/{id}': {
        get: {
          summary: '단일 유저 상세 조회',
          tags: ['User'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: '유저 ID',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: '유저 상세 정보',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            '404': {
              description: '유저를 찾을 수 없음',
            },
          },
          security: [{ BearerAuth: [] }],
        },
        put: {
          summary: '유저 정보 수정',
          tags: ['User'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: '유저 ID',
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserUpdateRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: '수정된 유저 정보',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
          security: [{ BearerAuth: [] }],
        },
        delete: {
          summary: '유저 삭제',
          tags: ['User'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: '유저 ID',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '204': { description: '삭제 성공 (내용 없음)' },
            '404': { description: '유저를 찾을 수 없음' },
          },
          security: [{ BearerAuth: [] }],
        },
      },
      '/users/{id}/roles': {
        get: {
          summary: '유저의 역할 목록 조회',
          tags: ['User', 'Role'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: '유저 ID',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: '역할 목록',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/RoleList' },
                },
              },
            },
          },
          security: [{ BearerAuth: [] }],
        },
        post: {
          summary: '유저에 역할 할당',
          tags: ['User', 'Role'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: '유저 ID',
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RoleAssignRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: '역할 할당 성공',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/RoleList' },
                },
              },
            },
          },
          security: [{ BearerAuth: [] }],
        },
      },
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'u-001' },
            name: { type: 'string', example: '홍길동' },
            email: { type: 'string', example: 'hong@company.com' },
            role: { type: 'string', example: 'ADMIN' },
          },
        },
        UserList: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 25 },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' },
            },
          },
        },
        UserCreateRequest: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
          },
        },
        UserUpdateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
          },
        },
        Role: {
          type: 'object',
          properties: {
            roleId: { type: 'string', example: 'admin' },
            roleName: { type: 'string', example: '관리자' },
          },
        },
        RoleList: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/Role' },
            },
          },
        },
        RoleAssignRequest: {
          type: 'object',
          required: ['roles'],
          properties: {
            roles: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  history: [
    {
      updatedAt: '2024-07-07T10:40:00.000Z',
      by: 'admin',
      comment: 'v1 최초등록',
    },
  ],
  createdAt: '2024-07-07T10:40:00.000Z',
  updatedAt: '2024-07-07T10:40:00.000Z',
}`;
