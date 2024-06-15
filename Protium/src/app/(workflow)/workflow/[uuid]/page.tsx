'use client';

import Loading from '@/app/loading';
import { RootReducerProps } from '@/app/store';
import HoverMessage from '@/components/overlays/hover_message';
import { BASE_URL, WS_URL } from '@/config';
import useAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { formatTime } from '@/lib/formatDate';
import { useAuthService } from '@/services/AuthService';
import {
  setNodeExecutedResults,
  setWorkflow,
} from '@/store/workflow/workflowSlice';
import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import RootReactFlow from './RootReactFlow';
import WorkflowTitleLabel from './WorkflowTitleLabel';

export default function Page({ params }: { params: { uuid: string } }) {
  const jwtAxios = useAxiosWithInterceptors();
  const { logout, userInfo, refreshAccessToken } = useAuthService();

  const [isLoading, setIsLoading] = useState(true);
  const [isConsoleExpand, setIsConsoleExpand] = useState(true);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);

  const dispatch = useDispatch();

  const fetchWorkflowDetail = async () => {
    try {
      setIsLoading(true);
      const res = await jwtAxios.get(
        `${BASE_URL}/workflow/workflow/${params.uuid}`,
      );
      dispatch(setWorkflow(res.data));
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const [socketUrl, setSocketUrl] = useState(
    params.uuid ? WS_URL + `/ws/workflow/${params.uuid}/` : null,
  );

  const { sendJsonMessage, sendMessage, getWebSocket, readyState } =
    useWebSocket(socketUrl, {
      onOpen: async () => {
        console.log('Connected to: ' + socketUrl);
        fetchWorkflowDetail();
      },
      onClose: (event: CloseEvent) => {
        console.log('Close Event', event);
        if (event.code == 4001) {
          console.log('Authentication Error');
          refreshAccessToken().catch((error) => {
            if (error.response && error.response.status === 401) {
              logout();
            }
          });
        }
        console.log('Close');
      },
      onError: () => alert('WebSocket Error'),
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        if (data.execute_status) {
          dispatch(
            setNodeExecutedResults({
              id: data.execute_status.uuid,
              header: data.execute_status.header,
              status: data.execute_status.status,
              results: data.execute_status.results,
              messages: data.execute_status.messages,
            }),
          );
        }
      },
      shouldReconnect: (closeEvent) => {
        /*
      useWebSocket will handle unmounting for you, but this is an example of a 
      case in which you would not want it to automatically reconnect
      */
        return true;
      },
      reconnectAttempts: 3,
      reconnectInterval: 3000,
    });

  const startWorkflow = async () => {
    try {
      await saveWorkflow();

      // 根据 readyState 判断 WebSocket 是否已经连接
      if (readyState === 1) {
        sendMessage('start');
      } else {
        console.error('WebSocket not ready');
        setSocketUrl(
          params.uuid ? WS_URL + `/ws/workflow/${params.uuid}/` : null,
        );
        sendMessage('start');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { workflow, nodes, edges, consoleInfo } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );

  const saveWorkflow = async () => {
    try {
      const res = await jwtAxios.put(
        `${BASE_URL}/workflow/workflow/${params.uuid}/`,
        {
          ...workflow,
          nodes,
          edges,
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveWorkflow = () => {
    saveWorkflow();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <WorkflowTitleLabel handleSaveWorkflow={handleSaveWorkflow} />
      <div className="relative h-full w-full">
        {/* Background */}
        <svg
          className="absolute inset-x-0 top-0 -z-10 h-[calc(100vh-4rem)] w-full stroke-neutral-100 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)] dark:stroke-neutral-800"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg
            x="50%"
            y={-1}
            className="overflow-visible fill-neutral-50 dark:fill-neutral-900"
          >
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
          />
        </svg>

        {/* Canvas */}
        <RootReactFlow />

        {/* <Command Pannel /> */}
        <div
          className={clsx(
            ' absolute bottom-4 right-56 isolate z-10 min-w-fit rounded-xl border bg-white  shadow-lg dark:border-none dark:bg-black',
            'transition-all duration-500 ease-in-out',
            isConsoleExpand ? 'h-[9.4rem]' : 'h-10',
            isConsoleVisible ? 'left-2' : 'left-1/2',
          )}
        >
          {/* Header */}
          <div
            className={clsx(
              'absolute top-0 h-10  w-full select-none justify-between rounded-t-xl px-4 dark:bg-neutral-800/40',
              'flex items-center',
            )}
          >
            <div className="flex w-fit items-center justify-start space-x-4 font-display text-sm">
              <div
                onClick={() => {
                  setIsConsoleVisible(!isConsoleVisible);
                }}
                className=" -m-1.5 cursor-pointer rounded p-1.5 text-neutral-400/80 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <ChevronDownIcon
                  className={clsx(
                    'h-4 w-4',
                    'transition-transform duration-300 ease-in-out',
                    isConsoleVisible ? ' -rotate-90' : 'rotate-90',
                  )}
                />
              </div>
              {isConsoleVisible && <span>Console</span>}
            </div>
            <div className="flex gap-x-4">
              <button
                onClick={handleSaveWorkflow}
                className="group relative -m-1.5 cursor-pointer rounded p-1.5 text-indigo-600 hover:bg-neutral-100 dark:text-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white"
              >
                <SquaresPlusIcon className="h-6 w-6 " />
                <HoverMessage position="top">Save</HoverMessage>
              </button>
              {
                <>
                  <button
                    onClick={startWorkflow}
                    className="group relative -m-1.5 cursor-pointer rounded  p-1.5 text-teal-500 hover:bg-neutral-100 hover:text-teal-600  dark:text-transparent dark:hover:bg-teal-600 dark:hover:text-white "
                  >
                    <PlayIcon className="h-6 w-6 stroke-teal-500 dark:stroke-teal-400" />
                    <HoverMessage position="top">Run</HoverMessage>
                  </button>

                  <div className="group relative -m-1.5 cursor-pointer rounded  p-1.5 text-amber-600 hover:bg-neutral-100 dark:text-amber-600 dark:hover:bg-amber-600 dark:hover:text-white  ">
                    <PauseIcon className="h-6 w-6  " />
                    <HoverMessage position="top">Pause</HoverMessage>
                  </div>
                </>
              }
              <div
                onClick={() => {
                  setIsConsoleExpand(!isConsoleExpand);
                }}
                className=" -m-1.5 cursor-pointer rounded p-1.5 text-neutral-400/80 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <ChevronDownIcon
                  className={clsx(
                    'h-6 w-6',
                    ' transition-transform duration-300 ease-in-out',
                    isConsoleExpand ? '' : 'rotate-180',
                  )}
                />
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="inert mt-10 h-[calc(100%-2.5rem)] px-4 py-4 text-2xs">
            <div className="inert h-full overflow-scroll">
              {consoleInfo.map((item, idx) => (
                <p key={idx}>
                  <span className=" mr-2 max-w-32 dark:text-neutral-400 text-neutral-500">
                    {formatTime(item.time)}
                  </span>
                  <span
                    className={clsx(
                      'text-neutral-900 dark:text-neutral-100',
                      item.type === 'error' && 'text-red-500 dark:text-red-400',
                      item.type === 'info' &&
                        'text-blue-500 dark:text-blue-400',
                      item.type === 'warning' &&
                        'text-yellow-500 dark:text-yellow-400',
                    )}
                  >
                    {item.message}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
