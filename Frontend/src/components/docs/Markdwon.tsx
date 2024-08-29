import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import 'katex/dist/katex.css';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownProps {
  content: string;
}

const Markdown: React.FC<MarkdownProps> = function Markdown(props) {
  const { content = '' } = props;

  const MarkdownComponents = {
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '') || [];
      let code = '';
      children.forEach((child: any) => {
        if (child instanceof Object) {
          code += child.props.children[0];
        } else {
          code += child;
        }
      });

      return inline || !match ? (
        <code className={className} {...props}>
          {children}
        </code>
      ) : (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      );
    },
  };
  return (
    <ReactMarkdown
      components={MarkdownComponents}
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[
        rehypeKatex,
        rehypeRaw,
        [rehypeHighlight, { ignoreMissing: true }],
      ]}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
