import Logo from '@/@brand/Logo';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  ChevronDoubleUpIcon,
  PaperAirplaneIcon,
  StarIcon,
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
  const [minimize, setMinimize] = useState(false);
  const [certificationId, setCertificationId] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardID, setCardID] = useState('');
  const [certification, setCertification] = useState<string | undefined>(
    undefined,
  );
  const [showCertification, setShowCertification] = useState(false);

  const fetchCertificationByCID = async () => {
    try {
      const response = await fetch(
        `https://deepmodeling.com/api/certificate/get/entity/byCID/display?cid=${certificationId}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch certification!');
      }
      const data = await response.json();
      setCertification(data[0].type_template);
      setShowCertification(true);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCertificationByName = async () => {
    try {
      const response = await fetch(
        `https://deepmodeling.com/api/certificate/get/entity/byID/display?name=${cardName}&p_id=${cardID}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch certification!');
      }
      const data = await response.json();
      setCertification(data[0].type_template);
      setShowCertification(true);
    } catch (error) {
      console.error(error);
    }
  };

  const categories = [
    {
      name: 'By Certification ID',
      posts: [
        {
          id: 1,
          placeholder: 'Enter Certification ID...',
          value: certificationId,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setCertificationId(e.target.value);
          },
        },
      ],
      onSubmit: fetchCertificationByCID,
    },
    {
      name: 'By Name/Card ID',
      posts: [
        {
          id: 1,
          placeholder: 'Enter Name...',
          value: cardName,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setCardName(e.target.value);
          },
        },
        {
          id: 2,
          placeholder: 'Enter Card ID...',
          value: cardID,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setCardID(e.target.value);
          },
        },
      ],
      onSubmit: fetchCertificationByName,
    },
  ];

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

  return (
    <div className="pointer-events-none flex h-screen w-screen select-none justify-center text-white">
      {!showCertification ? (
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
            minimize ? 'h-16' : 'h-2/3 min-h-fit overflow-scroll ',
            text3 === third_text
              ? 'pointer-events-none '
              : 'pointer-events-auto',
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
                <>
                  <div className=" pointer-events-auto mt-8 flex w-full justify-center">
                    <div className="mx-4 w-full">
                      <TabGroup>
                        <TabList className="flex gap-4">
                          {categories.map(({ name }) => (
                            <Tab
                              key={name}
                              className="text-md rounded-md px-3 py-1 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10  data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                            >
                              {name}
                            </Tab>
                          ))}
                        </TabList>
                        <TabPanels className="mt-2">
                          {categories.map(({ name, posts, onSubmit }) => (
                            <TabPanel
                              key={name}
                              className="flex flex-col gap-4 rounded-xl p-3"
                            >
                              {posts.map((post) => (
                                <div
                                  key={post.id}
                                  className="relative -mx-3 flex w-[102.5%] rounded-md bg-white/5 px-2 py-3 text-sm/6 transition hover:bg-white/10"
                                >
                                  <input
                                    type="text"
                                    name="certification"
                                    className="pointer-events-auto h-8 flex-1 select-auto border-l-2  border-white/70 bg-transparent p-2 placeholder:text-sm placeholder:text-neutral-200 focus:border-white/100 focus:outline-none "
                                    placeholder={post.placeholder}
                                    value={post.value}
                                    onChange={post.onChange}
                                  />
                                </div>
                              ))}
                              <div className="mt-2 flex justify-end">
                                <button
                                  type="button"
                                  onClick={onSubmit}
                                  className="flex items-center rounded-md border border-neutral-800/80  px-2.5 py-1.5 text-base font-semibold text-white shadow-sm     hover:bg-indigo-600 "
                                >
                                  <span className="">Submit</span>
                                  <PaperAirplaneIcon className="ml-1 h-4 w-4" />
                                </button>
                              </div>
                            </TabPanel>
                          ))}
                        </TabPanels>
                      </TabGroup>
                    </div>
                  </div>
                </>
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
      ) : (
        <div
          className={clsx(
            'relative z-10 mx-4 flex  items-center justify-center',
            'rounded-md transition-all',
            'inert pointer-events-auto',
            'aspect-auto translate-y-[20%] transition-all duration-500 ease-in-out',
            minimize ? 'h-16' : 'h-2/3 min-h-fit ',
          )}
        >
          <div className="h-full w-fit overflow-hidden shadow-lg  shadow-white/50 ">
            <img
              src={certification}
              className="h-full w-fit origin-top scale-100 opacity-95 transition-all delay-150 "
            />
          </div>
          <div className=" absolute inset-0 top-full flex translate-y-4 justify-between gap-4">
            <a
              href={certification}
              download={certification}
              className=" flex h-12 flex-1 items-center justify-center gap-2 rounded border border-neutral-700/20 bg-neutral-800/30 p-4 text-white shadow shadow-neutral-900/20 hover:bg-neutral-700/80"
            >
              <span className="font-display font-semibold">Download</span>
              <ArrowDownTrayIcon className="h-4 w-4" />
            </a>
            <button
              onClick={() => {}}
              className=" flex h-12 flex-1 items-center justify-center gap-2 rounded border border-neutral-700/20 bg-neutral-800/30 p-4 text-white shadow shadow-neutral-900/20 hover:bg-neutral-700/80"
            >
              <span className=" font-display font-semibold">Collect</span>
              <StarIcon className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowCertification(false)}
              className=" flex h-12 items-center justify-center gap-2 rounded border border-neutral-900 bg-neutral-800/30 p-4 text-white/50 shadow-lg shadow-neutral-900/20 hover:bg-neutral-800"
            >
              <ArrowUturnLeftIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeWriter;
