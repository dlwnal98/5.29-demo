// 샘플 데이터 (파일 내용 포함)
export const initialFileData = [
  {
    name: ".github",
    type: "folder",
    lastCommit: "Add GitHub workflows",
    commitTime: "2 days ago",
    author: "john-doe",
    content: null,
  },
  {
    name: "src",
    type: "folder",
    lastCommit: "Refactor components structure",
    commitTime: "3 days ago",
    author: "jane-smith",
    content: null,
  },
  {
    name: "public",
    type: "folder",
    lastCommit: "Add new assets",
    commitTime: "1 week ago",
    author: "mike-wilson",
    content: null,
  },
  {
    name: "package.json",
    type: "file",
    extension: "json",
    lastCommit: "Update dependencies",
    commitTime: "1 day ago",
    author: "john-doe",
    content: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A modern web application",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}`,
  },
  {
    name: "README.md",
    type: "file",
    extension: "md",
    lastCommit: "Update documentation",
    commitTime: "2 days ago",
    author: "jane-smith",
    content: `# My Project

A modern web application built with Next.js and React.

## Features

- 🚀 Fast and responsive
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Mobile-first design
- 🔒 Secure authentication
- 📊 Real-time analytics

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

\`\`\`
├── src/
│   ├── components/
│   ├── pages/
│   └── styles/
├── public/
└── package.json
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.`,
  },
  {
    name: "next.config.js",
    type: "file",
    extension: "js",
    lastCommit: "Configure build settings",
    commitTime: "5 days ago",
    author: "mike-wilson",
    content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'],
  },
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig`,
  },
];

// 최근 커밋 정보
export const latestCommit = {
  hash: "a1b2c3d",
  message: "Update documentation and fix styling issues",
  author: "jane-smith",
  time: "2 hours ago",
  avatar: "/placeholder-user.jpg",
};

// 브랜치 목록
export const branches = ["main", "develop", "feature/auth", "hotfix/security"];
