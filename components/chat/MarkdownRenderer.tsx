"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  content: string;
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code(props) {
          const { children, className } = props;

          const match = /language-(\w+)/.exec(className || "");

          if (match) {
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          }

          return (
            <code className="rounded bg-slate-800 px-1 py-0.5">
              {children}
            </code>
          );
        },

        table(props) {
          return (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                {props.children}
              </table>
            </div>
          );
        },

        th(props) {
          return (
            <th className="border border-slate-700 bg-slate-900 p-2 text-left">
              {props.children}
            </th>
          );
        },

        td(props) {
          return (
            <td className="border border-slate-700 p-2">
              {props.children}
            </td>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}