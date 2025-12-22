## 기존 프로젝트 분석 결과

### 페이지 목록
| 경로 | 파일 위치 | SSR/SSG 사용 |
|-----|---------|-------------|
| /auth-callback | ./app/auth-callback/page.tsx | SSR |
| /dashboard | ./app/dashboard/page.tsx | SSR |
| /forgot-password | ./app/forgot-password/page.tsx | SSR |
| /infra-packages/auth | ./app/infra-packages/auth/page.tsx | SSR |
| /infra-packages/config/projects/commit | ./app/infra-packages/config/projects/commit/page.tsx | SSR |
| /infra-packages/config/projects/commits | ./app/infra-packages/config/projects/commits/page.tsx | SSR |
| /infra-packages/config/projects/create | ./app/infra-packages/config/projects/create/page.tsx | SSR |
| /infra-packages/config/projects/edit | ./app/infra-packages/config/projects/edit/page.tsx | SSR |
| /infra-packages/config/projects/page | ./app/infra-packages/config/projects/page.tsx | SSR |
| /infra-packages/config/projects/upload | ./app/infra-packages/config/projects/upload/page.tsx | SSR |
| /infra-packages/config/projects/view | ./app/infra-packages/config/projects/view/page.tsx | SSR |
| /infra-packages/config/secret-key | ./app/infra-packages/config/secret-key/page.tsx | SSR |
| /infra-packages/eureka | ./app/infra-packages/eureka/page.tsx | SSR |
| /infra-packages/gateway | ./app/infra-packages/gateway/page.tsx | SSR |
| /members | ./app/members/page.tsx | SSR |
| /monitoring | ./app/monitoring/page.tsx | SSR |
| /organization-manage | ./app/organization-manage/page.tsx | SSR |
| /page | ./app/page.tsx | SSR |
| /pt | ./app/pt/page.tsx | SSR |
| /services/api-management/api-keys | ./app/services/api-management/api-keys/page.tsx | SSR |
| /services/api-management/models | ./app/services/api-management/models/page.tsx | SSR |
| /services/api-management | ./app/services/api-management/page.tsx | SSR |
| /services/api-management/resources/methods | ./app/services/api-management/resources/methods/page.tsx | SSR |
| /services/api-management/resources | ./app/services/api-management/resources/page.tsx | SSR |
| /services/api-management/stages | ./app/services/api-management/stages/page.tsx | SSR |
| /services/api-management/target-endpoints | ./app/services/api-management/target-endpoints/page.tsx | SSR |
| /settings/account | ./app/settings/account/page.tsx | SSR |
| /settings | ./app/settings/page.tsx | SSR |
| /signup/member | ./app/signup/member/page.tsx | SSR |
| /signup | ./app/signup/page.tsx | SSR |


### Next.js 전용 기능 사용 현황
| 기능 | 사용 파일 수 | 대체 방안 |
|-----|-----------|---------|
| next/link | 2개 | react-router-dom Link |
| next/navigation-useRouter | 12개 | useNavigate 등 |
| next/navigation-useSearchParams | *개 | useSearchParams 등 |
| next/navigation-usePathname | 4개 | useLocation().pathname 등 |
| next/headers | 2개 | * |