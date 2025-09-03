# MSA Configuration Front

이 프로젝트는 **React, NextJs, Typescript** 기반 프론트엔드 애플리케이션입니다.  
아래 내용은 프로젝트를 처음 받아서 **로컬에서 실행**하고, **서버에 배포**할 수 있는 가이드입니다.
<br>
<br>

## 1. 프로젝트 세팅 방법

> ⚠️ **Node.js 및 npm 설치 안내**
>
> 이 프로젝트를 실행하려면 로컬 컴퓨터에 **Node.js**와 **npm**이 설치되어 있어야 합니다.  
> 설치되어 있지 않다면 아래 Node.js 및 npm 설치 내용을 참고해주세요.

   <br>

1. 프로젝트 소스 다운 받기 `(2가지 방법 중 택 1)`
   <br>
   <br>
   - 저장소 클론

   ```bash
   > git clone <repository-url> # Clone with SSH 주소
   > cd msa-configuration-front
   ```

   - 소스 직접 다운

   ```bash
   > 해당 소스 압축 파일 해제 후 열기
   > cd msa-configuration-front
   ```

   <br>

2. 필요한 패키지 설치
   ```bash
   > npm install
   ```

<br>
<br>

## 2. 로컬 개발 환경 실행 방법

로컬에서 개발 서버를 띄우려면 :

```bash
# 터미널에 입력
npm run dev
```

- 기본적으로 `http://localhost:3000` 에서 애플리케이션이 실행됩니다.
- 코드 변경 시 자동으로 리로드됩니다.

<br>
<br>

## 3. 서버 배포 환경 (Nginx + Docker)

이 프로젝트는 **Nginx와 Docker**를 통해 서비스됩니다.  
서버 환경은 이미 세팅되어 있으며, 개발자가 해야 할 작업은 **빌드 산출물을 업로드하고 Docker 컨테이너를 재시작**하는 것입니다.  
또한, Docker 컨테이너는 **Alpine Linux 기반의 경량화된 Node.js Docker 이미지(node:24-alpine)**를 사용하여 구성되어 있습니다.

사용되는 Docker 실행 명령어는 다음과 같습니다:

```bash
docker run \
-d \
--name nex_react_ai \
--net nex_bridge100 --ip 172.100.0.16 \
--expose 3000 \
-v /home/nex_react_ai:/app -v /app/node_modules \
-w /app \
--health-cmd="curl -f http://localhost:3000/ || exit 1" \
--health-interval=30s \
--health-timeout=10s \
--health-retries=3 \
node:24-alpine sleep infinity
```

- Alpine Linux 기반의 경량 Node.js 이미지를 사용하여 컨테이너를 구성함으로써 효율적인 리소스 사용과 빠른 배포가 가능합니다.

<br>
<br>

## 4. 서버 배포 과정 (순차적으로 진행)

### 사전 빌드 파일 생성

- 해당 레포지토리 터미널에 명령어 입력

```bash
# git 소스 업데이트 (생략가능)
> git add .
> git commit -m "커밋 메세지"
> git push <remote 이름> <branch 이름>

# 정적파일 (build/) 파일 생성
> npm run build
```

- 파일 탐색기에서 해당 레포 `build`라는 이름으로 압축 진행
- `build.zip` 파일 준비 완료

  <br>

### 단계별 명령어

- `MobaXTerm` 등 SSH 클라이언트를 통해 서버 접속

1. 서버 접속

   ```bash
   # MobaXTerm 실행 -> 서버 접속 후 login

   > login as: nexfron
   > nefron@1.224.162.188's password: Nexf12#$
   ```

   <br>

2. 관리자 권한 전환

   ```bash
   > sudo -i
   > Nexf12#$ //비밀번호 입력
   ```

   <br>

3. 기존 배포 파일 제거

   ```bash
   > rm -rf /home/nex_react/*
   ```

   <br>

4. 새 빌드 파일 업로드 후 압축 해제
   `(build.zip 업로드 필수!)`

   ```bash
   > unzip /home/nexfron/build.zip -d /home/nex_react
   ```

   <br>

5. Docker 컨테이너 재시작

   ```bash
   > docker restart nex_react
   ```

   <br>

6. 컨테이너 내부 접속

   ```bash
   > docker exec -it nex_react sh
   ```

   <br>

7. 애플리케이션 빌드 및 실행

   ```bash
   > npm run build
   > npm run start
   ```

   <br>

## Node.js 및 npm 설치 안내

### 1. Node.js 설치

- 공식 웹사이트에서 설치 파일 다운로드: [https://nodejs.org/](https://nodejs.org/)
- **LTS 버전** 설치 권장
- 설치 후 터미널에서 버전 확인:

```bash
> node -v
#예시 출력 : v20.5.1
```

### 2. npm 설치 확인

- Node.js 설치 시 기본적으로 npm도 함께 설치됩니다.

```bash
> npm -v
#예시 출력 : 9.8.1
```

## 참고

- `build.zip` 파일은 로컬에서 `npm run build`를 통해 생성 후 업로드해야 합니다.
- Docker 및 Nginx 설정은 서버에 사전 구성되어 있으므로 별도의 설정은 필요하지 않습니다.
- 실행 후 애플리케이션은 Nginx를 통해 서비스됩니다.
  <br>
  <br>
  <br>
