import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

// 실제 서비스에서 쓰는 언어만 import
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';

const highlightOptions = {
  languages: { javascript, typescript, python, bash, json, sql, yaml },
  detect: false,
};

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  if (!content) return <div>내용이 없습니다.</div>;

  let parsedContent = content
    .replace(/\\n/g, '\n') // 먼저 \n 이스케이프 해제
    .replace(/\n/g, '  \n'); // 그다음 Markdown용 줄바꿈 변환

  return (
    <div className="prose prose-indigo max-w-none dark:prose-invert prose-a:text-blue-600 prose-h1:text-2xl prose-h2:text-xl prose-p:leading-relaxed prose-pre:bg-gray-100 prose-pre:border-0 prose-pre:rounded-md prose-pre:p-4 prose-pre:overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, highlightOptions]]}  // 옵션 적용
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="border-b-2 border-gray-200 pb-2 mb-4 text-2xl font-bold" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="border-b border-gray-300 pb-1 mb-3 text-xl font-semibold" {...props} />
          ),
          p: ({ node, ...props }) => <p className="flex flex-wrap items-center gap-2" {...props} />,
        }}>
        {parsedContent}
      </ReactMarkdown>
    </div>
  );
}
