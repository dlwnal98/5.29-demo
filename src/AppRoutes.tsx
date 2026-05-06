import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
// Eager load (즉시 로드) - 인증 관련
import LoginPage from '@/pages/login/LoginPage'
import AuthCallbackPage from '@/components/AuthCallbackPage'
import { AppLayout } from '@/components/layout/AppLayout'
import { Toaster } from "sonner"; // sonner 임포트

// Lazy load (지연 로드) - 나머지 페이지들
const SignupPage = lazy(() => import('@/pages/signup/SignupPage'))
const MemberSignupPage = lazy(() => import('@/pages/signup/MemberSignupPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'))

// Settings
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const SettingsAccountPage = lazy(() => import('@/pages/settings/SettingsAccountPage'))

// Infra Packages - Auth
const AuthPage = lazy(() => import('@/pages/infra-packages/auth/AuthPage'))

// Infra Packages - Eureka
const EurekaPage = lazy(() => import('@/pages/infra-packages/eureka/EurekaPage'))

// Infra Packages - Gateway
const GatewayPage = lazy(() => import('@/pages/infra-packages/gateway/GatewayPage'))

// Infra Packages - Config
const SecretKeyPage = lazy(() => import('@/pages/infra-packages/config/secretKey/SecretKeyPage'))
const ProjectsPage = lazy(() => import('@/pages/infra-packages/config/projects/ProjectsPage'))
const CreateProjectPage = lazy(() => import('@/pages/infra-packages/config/projects/CreateProjectPage'))
const EditProjectPage = lazy(() => import('@/pages/infra-packages/config/projects/EditProjectPage'))
const ViewProjectPage = lazy(() => import('@/pages/infra-packages/config/projects/ViewProjectPage'))
const UploadProjectPage = lazy(() => import('@/pages/infra-packages/config/projects/UploadProjectPage'))
const CommitPage = lazy(() => import('@/pages/infra-packages/config/projects/CommitPage'))
const CommitsPage = lazy(() => import('@/pages/infra-packages/config/projects/CommitsPage'))

// Services - API Management
const ApiManagementPage = lazy(() => import('@/pages/services/api-management/ApiManagementPage'))
const ResourcesPage = lazy(() => import('@/pages/services/api-management/resources/ResourcesPage'))
const MethodsPage = lazy(() => import('@/pages/services/api-management/resources/MethodsPage'))
const StagesPage = lazy(() => import('@/pages/services/api-management/stages/StagesPage'))
const ModelsPage = lazy(() => import('@/pages/services/api-management/models/ModelsPage'))
const RouteEndpointsPage = lazy(() => import('@/pages/services/api-management/route-endpoints/RouteEndpointsPage'))
const ApiKeysPage = lazy(() => import('@/pages/services/api-management/api-keys/ApiKeysPage'))
const UsageDashboardPage = lazy(() => import('@/pages/services/api-management/usage-dashboard/UsageDashboardPage'))
const ResourcesGridPage = lazy(() => import('@/pages/services/api-management/resources/ResourcesGridPage'))

// Other pages
const OrganizationManagePage = lazy(() => import('@/pages/OrganizationManagePage'))
const MonitoringPage = lazy(() => import('@/pages/MonitoringPage'))
const MembersPage = lazy(() => import('@/pages/members/MembersPage'))

// Loading fallback component (app/**/loading.tsx 역할)
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>

          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/member" element={<MemberSignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth-callback" element={<AuthCallbackPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/account" element={<SettingsAccountPage />} />

            {/* Infra Packages - Auth */}
            <Route path="/infra-packages/auth" element={<AuthPage />} />

            {/* Infra Packages - Eureka */}
            <Route path="/infra-packages/eureka" element={<EurekaPage />} />

            {/* Infra Packages - Gateway */}
            <Route path="/infra-packages/gateway" element={<GatewayPage />} />

            {/* Infra Packages - Config */}
            <Route path="/infra-packages/config/secret-key" element={<SecretKeyPage />} />
            <Route path="/infra-packages/config/projects" element={<ProjectsPage />} />
            <Route path="/infra-packages/config/projects/create" element={<CreateProjectPage />} />
            <Route path="/infra-packages/config/projects/edit" element={<EditProjectPage />} />
            <Route path="/infra-packages/config/projects/view" element={<ViewProjectPage />} />
            <Route path="/infra-packages/config/projects/upload" element={<UploadProjectPage />} />
            <Route path="/infra-packages/config/projects/commit" element={<CommitPage />} />
            <Route path="/infra-packages/config/projects/commits" element={<CommitsPage />} />

            {/* Services - API Management */}
            <Route path="/services/api-management" element={<ApiManagementPage />} />
            <Route path="/services/api-management/resources" element={<ResourcesPage />} />
            <Route path="/services/api-management/resources/methods" element={<MethodsPage />} />
            <Route path="/services/api-management/stages" element={<StagesPage />} />
            <Route path="/services/api-management/models" element={<ModelsPage />} />
            <Route path="/services/api-management/route-endpoints" element={<RouteEndpointsPage />} />
            <Route path="/services/api-management/api-keys" element={<ApiKeysPage />} />
            <Route path="/services/api-management/usage-dashboard" element={<UsageDashboardPage />} />
            <Route path="/services/api-management/resources-grid" element={<ResourcesGridPage />} />

            {/* Organization */}
            <Route path="/organization-manage" element={<OrganizationManagePage />} />

            {/* Monitoring */}
            <Route path="/monitoring" element={<MonitoringPage />} />

            {/* Members */}
            <Route path="/members" element={<MembersPage />} />
          </Route>
        </Route>

        {/* 404 - Redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
