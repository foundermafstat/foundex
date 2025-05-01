'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Components } from 'react-markdown';

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

export default function MarkdownMessage({ content, className = '' }: MarkdownMessageProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Define custom renderers for markdown elements
          h1: ({ children, ...props }) => <h1 className="text-xl font-bold my-2" {...props}>{children}</h1>,
          h2: ({ children, ...props }) => <h2 className="text-lg font-bold my-2" {...props}>{children}</h2>,
          h3: ({ children, ...props }) => <h3 className="text-md font-bold my-1" {...props}>{children}</h3>,
          p: ({ children, ...props }) => <p className="my-1" {...props}>{children}</p>,
          ul: ({ children, ...props }) => <ul className="list-disc ml-4 my-2" {...props}>{children}</ul>,
          ol: ({ children, ...props }) => <ol className="list-decimal ml-4 my-2" {...props}>{children}</ol>,
          li: ({ children, ...props }) => <li className="my-1" {...props}>{children}</li>,
          a: ({ children, ...props }) => <a className="text-blue-500 underline" {...props}>{children}</a>,
          code: ({ children, className, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            
            return isInline ? (
              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded" {...props}>{children}</code>
            ) : (
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded my-2 overflow-auto">
                <code className={className} {...props}>{children}</code>
              </pre>
            );
          },
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic" {...props}>{children}</blockquote>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
