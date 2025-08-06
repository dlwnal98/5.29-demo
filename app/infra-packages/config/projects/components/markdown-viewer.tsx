import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // 테이블, 체크박스 등 지원
import rehypeHighlight from "rehype-highlight"; // 코드 하이라이트 지원
import "highlight.js/styles/github.css"; // 하이라이트 테마

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  if (!content) return <div>내용이 없습니다.</div>;

  let parsedContent = content;
  try {
    parsedContent = JSON.parse(`"${content}"`).replace(/\n/g, "  \n"); // 또는 <br />
  } catch (e) {
    console.log(e);
  }

  return (
    <div className="prose prose-indigo max-w-none dark:prose-invert prose-a:text-blue-600 prose-h1:text-2xl prose-h2:text-xl prose-p:leading-relaxed prose-pre:bg-gray-100 prose-pre:border-0 prose-pre:rounded-md prose-pre:p-4 prose-pre:overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="border-b-2 border-gray-200 pb-2 mb-4 text-2xl font-bold"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="border-b border-gray-300 pb-1 mb-3 text-xl font-semibold"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="flex flex-wrap items-center gap-2" {...props} />
          ),
        }}
      >
        {parsedContent}
      </ReactMarkdown>
    </div>
  );
}
