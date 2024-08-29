'use client';
import Markdown from '@/components/docs/Markdwon';
import '@/styles/markdown.css';
import '@/styles/markdown.dark.css';
import { useState } from 'react';

const GithubReadme = ({ content }: { content: string }) => {
  const [readme, setReadme] = useState<string>(content);

  return (
    <div></div>
  )

  // return (
  //   <div className="flex gap-x-4 ring-1 rounded shadow dark:shadow-white">
  //     <div className="w-1/2">
  //       <textarea
  //         className="form-textarea h-full w-full border-0 bg-transparent ring-0 dark:text-white"
  //         value={readme}
  //         onChange={(e) => {
  //           setReadme(e.target.value);
  //         }}
  //       />
  //     </div>
  //     <div className="w-1/2">
  //       <div className="markdown">
  //         <Markdown content={readme} />
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default GithubReadme;