import Logo from '@/@brand/Logo';
import {
  ChevronDoubleUpIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
const TypeWriter: React.FC = () => {
  const first_text = 'Hello, Welcome to DeepModeling!';
  const second_text = "We are so glad to see you're here! 😊";
  const third_text =
    'Please write your certification ID to access your certification.';

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');

  // 展示第一段文字，时间间隔为100ms
  useEffect(() => {
    const timeout = setTimeout(() => {
      setText1(first_text.slice(0, text1.length + 1));
    }, 100);
    return () => clearTimeout(timeout);
  }, [text1]);

  // 在第一段文字展示完毕后，展示第二段文字
  useEffect(() => {
    if (text1 === first_text) {
      const timeout = setTimeout(() => {
        setText2(second_text.slice(0, text2.length + 1));
      }, 75);
      return () => clearTimeout(timeout);
    }
  }, [text1, text2]);

  // 在第二段文字展示完毕后，展示第三段文字
  useEffect(() => {
    if (text2 === second_text) {
      const timeout = setTimeout(() => {
        setText3(third_text.slice(0, text3.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [text2, text3]);

  //  删除效果
  //   const textState = ['istyping', 'isdeleting'];
  //   const [typing, setTyping] = useState(textState[0]);
  //   function sleep(ms: number) {
  //     return new Promise((resolve) => setTimeout(resolve, ms));
  //   }

  //   useEffect(() => {
  //     const timeout = setTimeout(() => {
  //       if (typing === 'istyping' && text1 !== first_text) {
  //         setText1(first_text.slice(0, text1.length + 1));
  //       } else if (text1 === first_text && typing === 'istyping') {
  //         sleep(2000).then(() => {
  //           setTyping(textState[1]);
  //         });
  //       } else if (
  //         (text1 === first_text && typing === 'isdeleting') ||
  //         typing === 'isdeleting'
  //       ) {
  //         setText1(first_text.slice(0, text1.length - 1));
  //         if (text1.length <= 2) {
  //           setTyping(textState[0]);
  //         }
  //       }
  //     }, 100);
  //     return () => clearTimeout(timeout);
  //   }, [text1, typing]);

  const [minimize, setMinimize] = useState(false);

  return (
    <div className="pointer-events-none flex h-screen w-screen select-none justify-center text-white">
      <div
        onClick={() => {
          setText1(first_text);
          setText2(second_text);
          setText3(third_text);
        }}
        className={clsx(
          'relative z-10 mx-4 flex flex-col',
          'rounded-md bg-gradient-to-tl from-black/80 to-black/50 py-4 shadow-md shadow-indigo-900/20 transition-all',
          'inert w-full overflow-hidden md:w-[60%] lg:w-[40%]',
          'aspect-auto translate-y-[20%] transition-all duration-500 ease-in-out',
          minimize ? 'h-16' : 'h-2/3 min-h-fit ',
          text3 === third_text ? 'pointer-events-none ' : 'pointer-events-auto',
        )}
      >
        {!minimize && (
          <>
            <div className="  flex flex-col gap-y-4 px-4 py-8">
              <div className="">
                <span
                  className={clsx(
                    'text-base font-semibold',
                    text1 === first_text ? '' : 'blinking-cursor',
                  )}
                >
                  {text1}
                </span>
              </div>
              <div className="">
                <span
                  className={clsx(
                    'text-base font-semibold',
                    text2 === second_text || text2 === ''
                      ? ''
                      : 'blinking-cursor',
                  )}
                >
                  {text2}
                </span>
              </div>
              <div>
                <span
                  className={clsx(
                    'text-base font-semibold',
                    text3 === '' ? '' : 'blinking-cursor',
                  )}
                >
                  {text3}
                </span>
              </div>
            </div>

            {text3 === third_text && (
              <div className="flex flex-col gap-y-6 p-4 duration-1000 animate-in fade-in slide-in-from-bottom-3">
                <label className="flex items-center gap-x-4 text-base font-semibold">
                  Certification ID:
                </label>
                <div className=" flex w-full gap-x-4">
                  <input
                    type="text"
                    name="certification"
                    className="pointer-events-auto h-8 flex-1 select-auto border-l-2  border-white/50 bg-transparent p-2
                 placeholder:text-sm focus:border-white/100 focus:outline-none "
                    placeholder="Enter Certification ID..."
                  />
                  <button
                    type="button"
                    className="flex items-center rounded-md border border-neutral-800/80  px-2.5 py-1.5 text-sm font-semibold
                 text-white shadow-sm 
                 hover:bg-neutral-800 "
                  >
                    <span className="text-base">Submit</span>
                    <PaperAirplaneIcon className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        <div className=" absolute bottom-0 right-0 z-10 p-4 text-white">
          <Logo className="h-8 w-8 fill-white" />
        </div>
        <div
          className=" group pointer-events-auto absolute bottom-0 left-0 p-4 hover:bg-neutral-800/80"
          onClick={() => setMinimize(!minimize)}
        >
          <ChevronDoubleUpIcon
            className={clsx(
              '  h-8 w-8 group-hover:text-white dark:text-neutral-700/80',
              'transition-transform',
              minimize ? 'rotate-180' : '',
            )}
          />
        </div>
        {/* <div className="text-base font-semibold">
          <SyntaxHighlighter
            className="blinking-cursor"
            language="javascript"
            style={dracula}
          >
            {text1}
          </SyntaxHighlighter>
        </div> */}

        {/* <div className=" text-base">
          <SyntaxHighlighter
            className="blinking-cursor"
            language="javascript"
            style={dracula}
          >
            {text2}
          </SyntaxHighlighter>
        </div>
        <div className=" text-base">
          <SyntaxHighlighter
            className="blinking-cursor"
            language="javascript"
            style={dracula}
          >
            {text3}
          </SyntaxHighlighter>
        </div>
        <div className=" text-base">
          <SyntaxHighlighter
            className="blinking-cursor"
            language="javascript"
            style={dracula}
          >
            {`}`}
          </SyntaxHighlighter>
        </div> */}
      </div>
    </div>
  );
};

export default TypeWriter;
