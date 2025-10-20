'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Cloud,
  AlertTriangle,
  Target,
  Calendar,
  Shield,
  CheckCircle,
  Database,
  Server,
  Zap,
  Users,
  Layers,
  Globe,
  Settings,
  Activity,
  Lock,
  Workflow,
  Building2,
  TrendingUp,
  Code,
  GitBranch,
  Repeat,
} from 'lucide-react';

export default function PTPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'AWS 기반 MSA 전환 POC',
      type: 'cover',
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <div className="text-center space-y-6">
            <Cloud className="w-32 h-32 mx-auto text-blue-500" />
            <h1 className="text-6xl font-bold text-gray-900">AWS 기반 MSA 전환</h1>
            <h2 className="text-4xl text-gray-600">POC 프로젝트 기술 검증</h2>
          </div>
          <div className="text-2xl text-gray-500 space-y-3 text-center">
            <p className="text-blue-600 font-semibold">목표: 2026년 6월 (단축 가능)</p>
            <p className="text-lg">상담 시스템 클라우드 마이그레이션 및 MSA 전환</p>
          </div>
        </div>
      ),
    },

    {
      title: '현재 시스템의 기술적 한계',
      subtitle: '모놀리식 아키텍처의 문제점',
      type: 'content',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">모놀리식 아키텍처</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 단일 WAR 파일에 모든 기능 결합</li>
                    <li>• 배포 시 전체 애플리케이션 재시작 필요</li>
                    <li>• 특정 모듈 장애 시 전체 시스템 영향</li>
                    <li>• 기능별 독립 스케일링 불가능</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Database className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">데이터베이스 병목</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 단일 Oracle DB에 모든 테이블 집중</li>
                    <li>• Schema 기반 논리적 분리만 존재</li>
                    <li>• 커넥션 풀 경합 발생</li>
                    <li>• 수평 확장 제약</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-300 rounded-lg p-4">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              AWS Well-Architected Framework 충족 현황
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-50 rounded p-2 border border-green-200">
                <p className="font-bold text-xs text-gray-900 mb-1">Operational Excellence ✓</p>
                <p className="text-xs text-gray-600">CloudWatch, X-Ray, CI/CD</p>
              </div>
              <div className="bg-green-50 rounded p-2 border border-green-200">
                <p className="font-bold text-xs text-gray-900 mb-1">Security ✓</p>
                <p className="text-xs text-gray-600">VPC, KMS, IAM Role</p>
              </div>
              <div className="bg-green-50 rounded p-2 border border-green-200">
                <p className="font-bold text-xs text-gray-900 mb-1">Reliability ✓</p>
                <p className="text-xs text-gray-600">Multi-AZ, Auto Scaling</p>
              </div>
              <div className="bg-green-50 rounded p-2 border border-green-200">
                <p className="font-bold text-xs text-gray-900 mb-1">Performance ✓</p>
                <p className="text-xs text-gray-600">ECS Fargate, ElastiCache</p>
              </div>
              <div className="bg-green-50 rounded p-2 border border-green-200">
                <p className="font-bold text-xs text-gray-900 mb-1">Cost Optimization ✓</p>
                <p className="text-xs text-gray-600">Auto Scaling, Reserved</p>
              </div>
              <div className="bg-yellow-50 rounded p-2 border border-yellow-200">
                <p className="font-bold text-xs text-gray-900 mb-1">Well-Architected Tool</p>
                <p className="text-xs text-gray-600">단계별 검증 계획</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Target className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-1">MSA 전환 목표</h3>
                <p className="text-sm text-gray-700">
                  마이크로서비스 아키텍처 전환을 통해 <strong>서비스별 독립 배포</strong>,{' '}
                  <strong>수평 확장</strong>, <strong>기술 스택 다양화</strong>를 실현하고,{' '}
                  <strong>표준화된 개발 프로세스</strong>를 구축합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: 'POC 기술 검증 목표',
      subtitle: '핵심 기술 스택 실현 가능성 확인',
      type: 'content',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-10 h-10 text-blue-600" />
              <div>
                <h3 className="text-2xl font-bold text-blue-900">목표 일정</h3>
                <p className="text-xl text-blue-700">2026년 6월 (더 단축 가능하면 단축)</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-gray-700">
                <strong>개발 방식:</strong> 필요한 시점에만 AWS 리소스 기동 (개발하지 않을 때는 서버
                중지)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white border-2 border-blue-300 rounded-lg p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">POC 단계</h3>
                <p className="text-sm text-gray-600">기술 검증</p>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>3개 마이크로서비스 구현</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Call + Chat + RBAC Service</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>WebSocket 실시간 통신</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>이벤트 기반 통신 (EventBridge)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-green-300 rounded-lg p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Beta 단계</h3>
                <p className="text-sm text-gray-600">안정성 확보</p>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Multi-AZ 고가용성 적용</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>RDS Proxy 연결 풀</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>통합 모니터링 대시보드</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>성능 테스트 (500 CCU)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-purple-300 rounded-lg p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Production</h3>
                <p className="text-sm text-gray-600">운영 최적화</p>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Auto Scaling 정책</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>DR(Disaster Recovery)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>부하 테스트 (1000+ CCU)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>99.9% SLA 달성</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-400 rounded-lg p-5">
            <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
              <Target className="w-6 h-6" />
              MVP 서비스 범위
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <p className="font-bold text-gray-900">Call Service</p>
                </div>
                <p className="text-xs text-gray-600">통화 관리, 고객 정보 연동, 상담 이력 통합</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <p className="font-bold text-gray-900">Chat Service</p>
                </div>
                <p className="text-xs text-gray-600">
                  실시간 채팅, WebSocket 통신, 메시지 히스토리
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <p className="font-bold text-gray-900">RBAC Service</p>
                </div>
                <p className="text-xs text-gray-600">계층적 권한 관리, OU 기반, Role 제어</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: '애자일 개발 방법론',
      subtitle: '반복적 증분 개발을 통한 위험 최소화',
      type: 'content',
      content: (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-5 shadow-xl">
            <h3 className="text-2xl font-bold mb-3 text-center">왜 애자일 방법론인가?</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/20 rounded-lg p-3">
                <p className="font-bold mb-1">✓ 빠른 피드백</p>
                <p className="opacity-90 text-xs">2주마다 동작하는 결과물 확인</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="font-bold mb-1">✓ 유연한 변경</p>
                <p className="opacity-90 text-xs">요구사항 변경에 신속 대응</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="font-bold mb-1">✓ 위험 분산</p>
                <p className="opacity-90 text-xs">작은 단위로 검증하며 진행</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="font-bold mb-1">✓ 지속적 개선</p>
                <p className="opacity-90 text-xs">회고를 통한 프로세스 개선</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-300 rounded-lg p-4">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Repeat className="w-6 h-6" />
              2주 스프린트 사이클
            </h3>
            <div className="grid grid-cols-5 gap-2">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-center mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white font-bold">
                    1
                  </div>
                </div>
                <p className="text-xs font-bold text-center mb-1">계획</p>
                <p className="text-xs text-gray-600">Sprint Planning</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-center mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white font-bold">
                    2
                  </div>
                </div>
                <p className="text-xs font-bold text-center mb-1">개발</p>
                <p className="text-xs text-gray-600">Daily Standup</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="text-center mb-2">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto text-white font-bold">
                    3
                  </div>
                </div>
                <p className="text-xs font-bold text-center mb-1">검증</p>
                <p className="text-xs text-gray-600">Testing & QA</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <div className="text-center mb-2">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto text-white font-bold">
                    4
                  </div>
                </div>
                <p className="text-xs font-bold text-center mb-1">시연</p>
                <p className="text-xs text-gray-600">Sprint Review</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                <div className="text-center mb-2">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mx-auto text-white font-bold">
                    5
                  </div>
                </div>
                <p className="text-xs font-bold text-center mb-1">회고</p>
                <p className="text-xs text-gray-600">Retrospective</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-4">
              <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                스프린트 구성 예시
              </h3>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-2 border border-gray-200">
                  <p className="font-bold text-xs text-blue-900">Sprint 1-2 (4주)</p>
                  <p className="text-xs text-gray-700">인프라 구축 + Call Service MVP</p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-gray-200">
                  <p className="font-bold text-xs text-green-900">Sprint 3-4 (4주)</p>
                  <p className="text-xs text-gray-700">Chat Service + WebSocket</p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-gray-200">
                  <p className="font-bold text-xs text-purple-900">Sprint 5-6 (4주)</p>
                  <p className="text-xs text-gray-700">RBAC Service + Cognito 통합</p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-gray-200">
                  <p className="font-bold text-xs text-orange-900">Sprint 7-8 (4주)</p>
                  <p className="text-xs text-gray-700">통합 테스트 + 모니터링 + 최적화</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-4">
              <h3 className="text-base font-bold text-green-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                MVP 우선 접근
              </h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="font-bold text-sm text-gray-900 mb-1">1단계: 핵심 기능</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 기본 CRUD 동작</li>
                    <li>• 서비스 간 통신 검증</li>
                    <li>• 인증/인가 기본 구현</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="font-bold text-sm text-gray-900 mb-1">2단계: 확장 기능</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 실시간 통신 안정화</li>
                    <li>• 성능 최적화</li>
                    <li>• 모니터링 강화</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-4">
            <h3 className="text-base font-bold text-purple-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              AWS Well-Architected Framework 준수
            </h3>
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div className="bg-white rounded p-2 border border-orange-200">
                <p className="font-bold text-orange-900">Operational</p>
                <p className="text-gray-600">지속적 개선</p>
              </div>
              <div className="bg-white rounded p-2 border border-red-200">
                <p className="font-bold text-red-900">Security</p>
                <p className="text-gray-600">매 스프린트 검증</p>
              </div>
              <div className="bg-white rounded p-2 border border-green-200">
                <p className="font-bold text-green-900">Reliability</p>
                <p className="text-gray-600">점진적 안정화</p>
              </div>
              <div className="bg-white rounded p-2 border border-purple-200">
                <p className="font-bold text-purple-900">Performance</p>
                <p className="text-gray-600">단계별 튜닝</p>
              </div>
              <div className="bg-white rounded p-2 border border-blue-200">
                <p className="font-bold text-blue-900">Cost</p>
                <p className="text-gray-600">필요시만 운영</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: 'POC 아키텍처 설계',
      subtitle: 'AWS Best Practice 기반',
      type: 'content',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-400 rounded-lg p-4">
            <h3 className="text-xl font-bold text-blue-900 mb-3">설계 원칙</h3>
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <Globe className="w-6 h-6 text-blue-500 mb-1" />
                <h4 className="font-bold mb-1">AWS 관리형 서비스</h4>
                <p className="text-gray-600">인프라 관리 부담 최소화</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <Server className="w-6 h-6 text-green-500 mb-1" />
                <h4 className="font-bold mb-1">서버리스 우선</h4>
                <p className="text-gray-600">ECS Fargate, Lambda</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <Zap className="w-6 h-6 text-purple-500 mb-1" />
                <h4 className="font-bold mb-1">이벤트 기반</h4>
                <p className="text-gray-600">느슨한 결합</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-orange-200">
                <Shield className="w-6 h-6 text-orange-500 mb-1" />
                <h4 className="font-bold mb-1">보안 내재화</h4>
                <p className="text-gray-600">VPC, Security Group</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" />
                마이크로서비스 구성
              </h3>
              <div className="space-y-2">
                <div className="bg-blue-50 rounded p-2 border border-blue-200">
                  <p className="font-bold text-blue-900 text-xs mb-1">Call Service</p>
                  <p className="text-xs text-gray-600">통화 관리, 고객 정보 연동, 상담 이력</p>
                </div>
                <div className="bg-green-50 rounded p-2 border border-green-200">
                  <p className="font-bold text-green-900 text-xs mb-1">Chat Service</p>
                  <p className="text-xs text-gray-600">실시간 채팅, WebSocket 통신</p>
                </div>
                <div className="bg-purple-50 rounded p-2 border border-purple-200">
                  <p className="font-bold text-purple-900 text-xs mb-1">RBAC Service</p>
                  <p className="text-xs text-gray-600">계층적 권한 관리, OU 기반</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-500" />
                데이터 저장소 전략
              </h3>
              <div className="space-y-2">
                <div className="bg-purple-50 rounded p-2 border border-purple-200">
                  <p className="font-bold text-purple-900 text-xs mb-1">RDS Aurora MariaDB</p>
                  <p className="text-xs text-gray-600">Call Service 데이터 (고객, 상담)</p>
                  <p className="text-xs text-gray-500">Database per Service 패턴</p>
                </div>
                <div className="bg-blue-50 rounded p-2 border border-blue-200">
                  <p className="font-bold text-blue-900 text-xs mb-1">DynamoDB</p>
                  <p className="text-xs text-gray-600">채팅 메시지, WebSocket 연결</p>
                  <p className="text-xs text-gray-500">빠른 쓰기, TTL 자동 삭제</p>
                </div>
                <div className="bg-green-50 rounded p-2 border border-green-200">
                  <p className="font-bold text-green-900 text-xs mb-1">ElastiCache Redis</p>
                  <p className="text-xs text-gray-600">세션, 캐시, 권한 정보</p>
                  <p className="text-xs text-gray-500">TTL 기반 자동 만료</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3">
              <h3 className="text-base font-bold text-yellow-900 mb-2">통신 패턴</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-white rounded p-2 border border-gray-200">
                  <p className="font-bold text-gray-900">동기 통신 (REST)</p>
                  <p className="text-gray-700">API Gateway → ALB → ECS</p>
                </div>
                <div className="bg-white rounded p-2 border border-gray-200">
                  <p className="font-bold text-gray-900">비동기 통신 (Event)</p>
                  <p className="text-gray-700">EventBridge → SQS → ECS/Lambda</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3">
              <h3 className="text-base font-bold text-green-900 mb-2">AWS 권장 사항 적용</h3>
              <ul className="space-y-1 text-xs text-gray-700">
                <li className="flex items-start gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>API Gateway WebSocket:</strong> 완전 관리형
                  </span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>EventBridge:</strong> 느슨한 결합
                  </span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Database per Service:</strong> 독립성
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: 'RBAC 서비스 설계',
      subtitle: 'AWS Cognito + Hierarchical RBAC 통합 아키텍처',
      type: 'content',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-4 shadow-xl">
            <h3 className="text-xl font-bold mb-2 text-center">AWS Cognito + RBAC 통합 아키텍처</h3>
            <p className="text-center text-sm opacity-90">인증(Cognito) + 인가(RBAC) 분리 설계</p>
          </div>

          <div className="bg-white border-2 border-blue-300 rounded-lg p-4">
            <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              인증 vs 인가 역할 분리
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded p-3 border-l-4 border-blue-500">
                <p className="font-bold text-blue-900 text-sm mb-2">인증 (Authentication)</p>
                <p className="text-xs text-gray-700 mb-2">
                  <strong>담당:</strong> AWS Cognito User Pools
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 사용자 로그인/회원가입</li>
                  <li>• JWT 토큰 발급 및 검증</li>
                  <li>• MFA (Google OTP 지원)</li>
                  <li>• 사용자 속성 관리 (tenantId, role)</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded p-3 border-l-4 border-purple-500">
                <p className="font-bold text-purple-900 text-sm mb-2">인가 (Authorization)</p>
                <p className="text-xs text-gray-700 mb-2">
                  <strong>담당:</strong> RBAC Service
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• OU 기반 계층적 권한 관리</li>
                  <li>• Role 기반 세밀한 권한 제어</li>
                  <li>• 리소스별 접근 권한 확인</li>
                  <li>• 동적 권한 변경 및 관리</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border-2 border-purple-300 rounded-lg p-3">
              <h3 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Organizational Units (OU)
              </h3>
              <div className="space-y-2">
                <div className="bg-purple-50 rounded p-2 border border-purple-200">
                  <p className="font-bold text-gray-900 text-xs mb-1">계층 구조</p>
                  <pre className="text-xs text-gray-700 font-mono">
                    {`Root OU (조직)
  ├─ 영업부 OU
  │   ├─ 영업1팀 OU
  │   └─ 영업2팀 OU
  └─ 고객지원부 OU
      ├─ 상담팀 OU
      └─ CS팀 OU`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-blue-300 rounded-lg p-3">
              <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Role-Based Access Control
              </h3>
              <div className="space-y-2">
                <div className="bg-blue-50 rounded p-2 border border-blue-200">
                  <p className="font-bold text-gray-900 text-xs mb-1">역할 계층</p>
                  <pre className="text-xs text-gray-700 font-mono">
                    {`Admin (관리자)
  ├─ Manager (매니저)
  │   └─ TeamLead (팀장)
  │       └─ Agent (상담사)
  └─ Supervisor`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-3">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-green-500" />
              전체 인증/인가 흐름
            </h3>
            <div className="bg-gray-50 rounded p-2 border border-gray-200">
              <div className="flex items-center gap-2 text-xs">
                <div className="bg-blue-100 rounded p-2 flex-1 text-center border border-blue-300">
                  <p className="font-bold text-blue-900">1. 로그인</p>
                  <p className="text-gray-600 text-xs">Cognito</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-green-100 rounded p-2 flex-1 text-center border border-green-300">
                  <p className="font-bold text-green-900">2. JWT 발급</p>
                  <p className="text-gray-600 text-xs">토큰</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-purple-100 rounded p-2 flex-1 text-center border border-purple-300">
                  <p className="font-bold text-purple-900">3. API 요청</p>
                  <p className="text-gray-600 text-xs">Bearer</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-yellow-100 rounded p-2 flex-1 text-center border border-yellow-300">
                  <p className="font-bold text-yellow-900">4. RBAC 확인</p>
                  <p className="text-gray-600 text-xs">권한</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-400 rounded-lg p-3">
            <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />왜 Cognito와 RBAC를 분리했는가?
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-700">
              <div className="bg-white rounded p-2 border border-blue-200">
                <p className="font-bold text-blue-900 mb-1">✓ 관심사 분리</p>
                <p className="text-xs">인증과 인가의 명확한 역할 구분</p>
              </div>
              <div className="bg-white rounded p-2 border border-green-200">
                <p className="font-bold text-green-900 mb-1">✓ 세밀한 제어</p>
                <p className="text-xs">OU + Role 복합 권한 관리</p>
              </div>
              <div className="bg-white rounded p-2 border border-purple-200">
                <p className="font-bold text-purple-900 mb-1">✓ 확장성</p>
                <p className="text-xs">비즈니스 로직 독립적 변경</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: '기술 스택 상세',
      subtitle: 'POC → Beta → Production 진화',
      type: 'content',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-blue-900 text-center mb-3">POC 단계</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-white rounded p-2">
                  <p className="font-bold text-gray-900 mb-1">컴퓨팅:</p>
                  <p className="text-gray-600">ECS Fargate (0.25 vCPU)</p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="font-bold text-gray-900 mb-1">데이터베이스:</p>
                  <p className="text-gray-600">RDS Aurora MariaDB t4g.medium</p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="font-bold text-gray-900 mb-1">목표:</p>
                  <p className="text-gray-600">100 CCU, &lt;500ms, 99%</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 shadow-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-green-900 text-center mb-3">Beta 단계</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-white rounded p-2">
                  <p className="font-bold text-gray-900 mb-1">컴퓨팅:</p>
                  <p className="text-gray-600">ECS Fargate (0.5-1 vCPU)</p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="font-bold text-gray-900 mb-1">데이터베이스:</p>
                  <p className="text-gray-600">RDS Aurora r6g.large Multi-AZ</p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="font-bold text-gray-900 mb-1">목표:</p>
                  <p className="text-gray-600">500 CCU, &lt;300ms, 99.5%</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-4 shadow-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-purple-900 text-center mb-3">Production</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-white rounded p-2">
                  <p className="font-bold text-gray-900 mb-1">컴퓨팅:</p>
                  <p className="text-gray-600">ECS Fargate (1-2 vCPU)</p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="font-bold text-gray-900 mb-1">데이터베이스:</p>
                  <p className="text-gray-600">Aurora Serverless v2 Multi-Region</p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="font-bold text-gray-900 mb-1">목표:</p>
                  <p className="text-gray-600">1000+ CCU, &lt;200ms, 99.9%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <h3 className="text-base font-bold text-gray-900 mb-3">공통 기술 스택</h3>
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div className="bg-blue-50 rounded p-2 border border-blue-200">
                <p className="font-bold text-gray-900 mb-1">언어/프레임워크</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Java 25</li>
                  <li>• Spring Boot 3.5.6</li>
                  <li>• Spring Cloud AWS</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded p-2 border border-green-200">
                <p className="font-bold text-gray-900 mb-1">API</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• REST API</li>
                  <li>• WebSocket</li>
                  <li>• EventBridge</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded p-2 border border-purple-200">
                <p className="font-bold text-gray-900 mb-1">보안</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• JWT 인증</li>
                  <li>• AWS KMS</li>
                  <li>• AES-256 암호화</li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded p-2 border border-orange-200">
                <p className="font-bold text-gray-900 mb-1">모니터링</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• CloudWatch</li>
                  <li>• X-Ray</li>
                  <li>• Container Insights</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3">
            <h3 className="text-sm font-bold text-yellow-900 mb-2">
              POC에서 제외 (Beta/Production에서 적용)
            </h3>
            <ul className="grid grid-cols-2 gap-1 text-xs text-gray-700">
              <li>✗ Multi-AZ 고가용성 (Single AZ로 개발)</li>
              <li>✗ RDS Proxy (Direct Connection 사용)</li>
              <li>✗ Multi-Region DR (서울 리전만)</li>
              <li>✗ 대규모 성능 테스트 (1000+ CCU)</li>
            </ul>
          </div>
        </div>
      ),
    },

    {
      title: 'AWS Well-Architected Framework',
      subtitle: '클라우드 아키텍처 설계의 글로벌 표준',
      type: 'content',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 shadow-xl">
            <h3 className="text-xl font-bold mb-2 text-center">
              AWS Well-Architected Framework란?
            </h3>
            <p className="text-center text-sm opacity-90">
              클라우드에서 안전하고 효율적인 시스템을 구축하기 위한 AWS 공식 설계 원칙
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border-2 border-blue-300 rounded-lg p-3">
              <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                AWS 공식 권고사항
              </h3>
              <div className="space-y-2">
                <div className="bg-blue-50 rounded p-2 border border-blue-200">
                  <p className="font-bold text-xs mb-1">1. API Gateway WebSocket API</p>
                  <p className="text-xs text-gray-700">AWS 완전 관리형 WebSocket 서비스</p>
                </div>
                <div className="bg-green-50 rounded p-2 border border-green-200">
                  <p className="font-bold text-xs mb-1">2. EventBridge</p>
                  <p className="text-xs text-gray-700">서비스 간 느슨한 결합</p>
                </div>
                <div className="bg-purple-50 rounded p-2 border border-purple-200">
                  <p className="font-bold text-xs mb-1">3. Database per Service</p>
                  <p className="text-xs text-gray-700">마이크로서비스 독립성 보장</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-green-300 rounded-lg p-3">
              <h3 className="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                글로벌 SaaS 기업 사례
              </h3>
              <div className="space-y-2">
                <div className="bg-blue-50 rounded p-2 border border-blue-200">
                  <p className="font-bold text-xs mb-1">Zendesk</p>
                  <p className="text-xs text-gray-700">ECS Fargate + EventBridge</p>
                </div>
                <div className="bg-green-50 rounded p-2 border border-green-200">
                  <p className="font-bold text-xs mb-1">Intercom</p>
                  <p className="text-xs text-gray-700">WebSocket 기반 실시간 채팅</p>
                </div>
                <div className="bg-purple-50 rounded p-2 border border-purple-200">
                  <p className="font-bold text-xs mb-1">Twilio</p>
                  <p className="text-xs text-gray-700">API Gateway + ECS 패턴</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-purple-300 rounded-lg p-3">
            <h3 className="text-sm font-bold text-purple-900 mb-2">5가지 기둥 (Pillars)</h3>
            <div className="grid grid-cols-5 gap-2">
              <div className="bg-orange-50 rounded p-2 border border-orange-200 text-center">
                <p className="font-bold text-xs text-orange-900">Operational Excellence</p>
                <p className="text-xs text-gray-600 mt-1">운영 우수성</p>
              </div>
              <div className="bg-red-50 rounded p-2 border border-red-200 text-center">
                <p className="font-bold text-xs text-red-900">Security</p>
                <p className="text-xs text-gray-600 mt-1">보안</p>
              </div>
              <div className="bg-green-50 rounded p-2 border border-green-200 text-center">
                <p className="font-bold text-xs text-green-900">Reliability</p>
                <p className="text-xs text-gray-600 mt-1">안정성</p>
              </div>
              <div className="bg-purple-50 rounded p-2 border border-purple-200 text-center">
                <p className="font-bold text-xs text-purple-900">Performance</p>
                <p className="text-xs text-gray-600 mt-1">성능 효율성</p>
              </div>
              <div className="bg-blue-50 rounded p-2 border border-blue-200 text-center">
                <p className="font-bold text-xs text-blue-900">Cost</p>
                <p className="text-xs text-gray-600 mt-1">비용 최적화</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-3 shadow-lg">
            <div className="text-center">
              <p className="text-base font-bold mb-1">글로벌 표준을 따르는 검증된 아키텍처</p>
              <p className="text-xs opacity-90">
                AWS Well-Architected Framework 5가지 기둥 모두 충족
              </p>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: '레거시 현대화 전략',
      subtitle: 'Strangler Fig Pattern + 글로벌 SaaS 진화 사례',
      type: 'content',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-4 shadow-xl">
            <h3 className="text-xl font-bold mb-2 text-center">
              Martin Fowler의 Strangler Fig Pattern
            </h3>
            <p className="text-center text-sm opacity-90">
              레거시를 점진적으로 "교살"하며 새 시스템으로 교체
            </p>
          </div>

          <div className="bg-white border-2 border-purple-300 rounded-lg p-3">
            <h3 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              글로벌 SaaS 기업의 MSA 진화 과정
            </h3>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded p-2 border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">N</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-xs">Netflix</p>
                    <p className="text-xs text-gray-600">2008 → 2012</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="bg-white rounded p-1 border border-gray-200">
                    <p className="font-bold text-xs">2008: 모놀리스</p>
                  </div>
                  <div className="bg-white rounded p-1 border border-gray-200">
                    <p className="font-bold text-xs">2009-2011: 분리</p>
                  </div>
                  <div className="bg-white rounded p-1 border border-gray-200">
                    <p className="font-bold text-xs">2012: 완전 MSA</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded p-2 border border-orange-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-xs">Amazon</p>
                    <p className="text-xs text-gray-600">2001 → 2006</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="bg-white rounded p-1 border border-gray-200">
                    <p className="font-bold text-xs">2001: Obidos</p>
                  </div>
                  <div className="bg-white rounded p-1 border border-gray-200">
                    <p className="font-bold text-xs">2002-2005: SOA</p>
                  </div>
                  <div className="bg-white rounded p-1 border border-gray-200">
                    <p className="font-bold text-xs">2006: Two-Pizza</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded p-2 border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">U</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-xs">Uber</p>
                    <p className="text-xs text-gray-600">2012 → 2015</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="bg-white rounded p-1 border border-gray-200">
                    <p className="font-bold text-xs">2012: 모놀리스</p>
                  </div>
                  <div className="bg-white rounded p-1 border border-gray-200">
                    <p className="font-bold text-xs">2013-2014: 분리</p>
                  </div>
                  <div className="bg-white rounded p-1 border border-gray-200">
                    <p className="font-bold text-xs">2015: 완전 MSA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3">
            <h3 className="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              공통 패턴과 교훈
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div>
                <p className="font-bold text-gray-900 mb-1">✓ 초기 전략</p>
                <ul className="space-y-1">
                  <li>• 모두 모놀리스로 시작</li>
                  <li>• 스케일 문제 발생 시점부터 분리</li>
                  <li>• 가장 독립적인 도메인부터 추출</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">✓ 전환 기간</p>
                <ul className="space-y-1">
                  <li>• 평균 3-5년 소요 (점진적 전환)</li>
                  <li>• 핵심 서비스 우선, 나머지는 순차 분리</li>
                  <li>• 일부는 모놀리스 유지</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-3 shadow-lg">
            <p className="text-center text-sm font-bold">
              "엔터프라이즈 레거시 현대화의 교과서적 사례"
            </p>
            <p className="text-center text-xs opacity-90 mt-1">
              Martin Fowler와 AWS가 권장하는 바로 그 패턴
            </p>
          </div>
        </div>
      ),
    },

    {
      title: '구현 로드맵',
      subtitle: '애자일 스프린트 기반 실행 계획',
      type: 'content',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-5 shadow-xl">
            <h3 className="text-2xl font-bold mb-2 text-center">POC 목표: 2026년 6월</h3>
            <p className="text-center text-lg opacity-90">애자일 스프린트 방식 (2주 단위)</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-400 rounded-lg p-4">
            <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
              <Repeat className="w-6 h-6" />
              스프린트 기반 개발 계획
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      1-2
                    </div>
                    <div>
                      <p className="font-bold text-sm">Sprint 1-2 (4주)</p>
                      <p className="text-xs text-gray-600">인프라 + Call Service</p>
                    </div>
                  </div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• VPC, Security Group 구성</li>
                    <li>• RDS, DynamoDB, Redis 설정</li>
                    <li>• Call Service MVP 개발</li>
                    <li>• 통화 관리 기본 CRUD API</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      3-4
                    </div>
                    <div>
                      <p className="font-bold text-sm">Sprint 3-4 (4주)</p>
                      <p className="text-xs text-gray-600">Chat Service</p>
                    </div>
                  </div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Chat Service 개발</li>
                    <li>• WebSocket API 구현</li>
                    <li>• 실시간 메시징 테스트</li>
                    <li>• DynamoDB 최적화</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      5-6
                    </div>
                    <div>
                      <p className="font-bold text-sm">Sprint 5-6 (4주)</p>
                      <p className="text-xs text-gray-600">RBAC Service</p>
                    </div>
                  </div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• RBAC Service 개발</li>
                    <li>• Cognito 통합</li>
                    <li>• OU 기반 권한 관리</li>
                    <li>• Role 기반 접근 제어</li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      7-8
                    </div>
                    <div>
                      <p className="font-bold text-sm">Sprint 7-8 (4주)</p>
                      <p className="text-xs text-gray-600">통합 + 최적화</p>
                    </div>
                  </div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 전체 서비스 통합 테스트</li>
                    <li>• EventBridge 이벤트 검증</li>
                    <li>• 모니터링 대시보드</li>
                    <li>• 성능 테스트 (100 CCU)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border-2 border-blue-300 rounded-lg p-3">
              <h3 className="text-sm font-bold text-blue-900 mb-2">매 스프린트 반복</h3>
              <ul className="space-y-1 text-xs text-gray-700">
                <li className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Sprint Planning (월요일)</span>
                </li>
                <li className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Daily Standup (매일 15분)</span>
                </li>
                <li className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Sprint Review (금요일)</span>
                </li>
                <li className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Retrospective (금요일)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-green-300 rounded-lg p-3">
              <h3 className="text-sm font-bold text-green-900 mb-2">개발 리소스</h3>
              <div className="space-y-1 text-xs">
                <div className="bg-blue-50 rounded p-2">
                  <p className="font-bold text-gray-900">백엔드 개발자</p>
                  <p className="text-gray-600">마이크로서비스 구현</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="font-bold text-gray-900">DevOps 엔지니어</p>
                  <p className="text-gray-600">AWS 인프라 구축</p>
                </div>
                <div className="bg-purple-50 rounded p-2">
                  <p className="font-bold text-gray-900">PM/기획</p>
                  <p className="text-gray-600">요구사항 및 일정 관리</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-lg p-3">
              <h3 className="text-sm font-bold text-orange-900 mb-2 flex items-center gap-1">
                <Users className="w-4 h-4" />
                메가존 협력
              </h3>
              <ul className="space-y-1 text-xs text-gray-700">
                <li className="flex items-start gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>3주 Lift-On@Scale 프로그램</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>아키텍처 설계 피드백</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Best Practice 검증</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>전문가 멘토링</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: '검증 프로세스',
      subtitle: '스프린트별 체크포인트',
      type: 'content',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border-2 border-blue-300">
              <div className="text-center mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1 text-white font-bold text-lg">
                  1
                </div>
                <p className="font-bold text-gray-900 text-sm">Sprint 1-2 검증</p>
                <p className="text-xs text-gray-600">인프라 + Call</p>
              </div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>✓ VPC 네트워크 구성</li>
                <li>✓ RDS 연결 테스트</li>
                <li>✓ ECR 이미지 푸시</li>
                <li>✓ ECS 태스크 실행</li>
                <li>✓ Call Service CRUD 동작</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-3 border-2 border-green-300">
              <div className="text-center mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 text-white font-bold text-lg">
                  2
                </div>
                <p className="font-bold text-gray-900 text-sm">Sprint 3-6 검증</p>
                <p className="text-xs text-gray-600">Chat + RBAC</p>
              </div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>✓ Chat Service 완성</li>
                <li>✓ WebSocket 연결</li>
                <li>✓ RBAC Service 완성</li>
                <li>✓ 권한 제어 검증</li>
                <li>✓ 서비스 간 통신 검증</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-3 border-2 border-purple-300">
              <div className="text-center mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-1 text-white font-bold text-lg">
                  ✓
                </div>
                <p className="font-bold text-gray-900 text-sm">Sprint 7-8 검증</p>
                <p className="text-xs text-gray-600">POC 완료</p>
              </div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>✓ RBAC 권한 동작</li>
                <li>✓ 100 CCU 테스트 통과</li>
                <li>✓ 응답시간 기준 충족</li>
                <li>✓ 안정성 검증 완료</li>
                <li>✓ 아키텍처 문서화</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4">
              <h3 className="text-base font-bold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                POC 성공 기준
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <span>
                    <strong>기능:</strong> 3개 마이크로서비스 정상 동작 (Call, Chat, RBAC)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <span>
                    <strong>성능:</strong> 100 CCU 지원, 응답 시간 &lt; 500ms
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <span>
                    <strong>안정성:</strong> 24시간 무중단 운영
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <span>
                    <strong>보안:</strong> 인증/인가, 암호화 적용
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4">
              <h3 className="text-base font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                테스트 전략
              </h3>
              <div className="space-y-2">
                <div className="bg-white rounded p-2 border border-gray-200">
                  <p className="font-bold text-gray-900 text-xs mb-1">1. 단위 테스트</p>
                  <p className="text-xs text-gray-700">JUnit, Mockito로 코드 검증</p>
                </div>
                <div className="bg-white rounded p-2 border border-gray-200">
                  <p className="font-bold text-gray-900 text-xs mb-1">2. 통합 테스트</p>
                  <p className="text-xs text-gray-700">TestContainers로 DB 연동 테스트</p>
                </div>
                <div className="bg-white rounded p-2 border border-gray-200">
                  <p className="font-bold text-gray-900 text-xs mb-1">3. 부하 테스트</p>
                  <p className="text-xs text-gray-700">JMeter로 100 CCU 시뮬레이션</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: '프로젝트 진행 계획',
      type: 'content',
      content: (
        <div className="flex flex-col justify-center h-full space-y-6">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white rounded-xl p-6 shadow-2xl">
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold">POC 프로젝트 진행 계획</h3>
              <div className="grid grid-cols-3 gap-4 text-base mt-4">
                <div>
                  <Calendar className="w-8 h-8 mx-auto mb-2" />
                  <p className="opacity-90 mb-1">목표</p>
                  <p className="text-xl font-bold">2026년 6월</p>
                  <p className="text-xs opacity-75">(단축 가능)</p>
                </div>
                <div>
                  <Repeat className="w-8 h-8 mx-auto mb-2" />
                  <p className="opacity-90 mb-1">개발 방식</p>
                  <p className="text-xl font-bold">2주 스프린트</p>
                  <p className="text-xs opacity-75">(애자일 방법론)</p>
                </div>
                <div>
                  <Server className="w-8 h-8 mx-auto mb-2" />
                  <p className="opacity-90 mb-1">리소스 운영</p>
                  <p className="text-xl font-bold">필요시 기동</p>
                  <p className="text-xs opacity-75">(비개발시 중지)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4">
              <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                기대 효과
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold">서비스별 독립 배포</p>
                    <p className="text-xs text-gray-600">전체 시스템 중단 없이 업데이트</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold">수평 확장 가능</p>
                    <p className="text-xs text-gray-600">트래픽 증가에 유연한 대응</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold">장애 격리</p>
                    <p className="text-xs text-gray-600">특정 서비스 장애가 전체 영향 최소화</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold">기술 스택 다양화</p>
                    <p className="text-xs text-gray-600">서비스별 최적 기술 선택</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4">
              <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                리스크 관리
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold">점진적 전환</p>
                    <p className="text-xs text-gray-600">2주 스프린트로 단계별 검증</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold">검증된 기술 스택</p>
                    <p className="text-xs text-gray-600">AWS 공식 권고 + 글로벌 SaaS 사례</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold">빠른 피드백</p>
                    <p className="text-xs text-gray-600">매 스프린트 동작하는 결과물 확인</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-bold">메가존 협력</p>
                    <p className="text-xs text-gray-600">3주 Lift-On@Scale 프로그램</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: '감사합니다',
      type: 'cover',
      content: (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">감사합니다</h1>
          <p className="text-2xl text-gray-600">질문과 토론을 환영합니다</p>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-12 min-h-[600px]">
            {slides[currentSlide].type === 'cover' ? (
              slides[currentSlide].content
            ) : (
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {slides[currentSlide].title}
                  </h2>
                  {slides[currentSlide].subtitle && (
                    <p className="text-xl text-gray-600">{slides[currentSlide].subtitle}</p>
                  )}
                </div>
                <div className="flex-1 overflow-auto">{slides[currentSlide].content}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur border-t border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentSlide === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
            }`}>
            <ChevronLeft className="w-5 h-5" />
            이전
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === currentSlide
                    ? 'w-12 h-3 bg-blue-500 rounded-full'
                    : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentSlide === slides.length - 1
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
            }`}>
            다음
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-3 text-white text-sm">
          슬라이드 {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
}
