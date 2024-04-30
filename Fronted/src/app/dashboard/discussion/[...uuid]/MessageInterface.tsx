'use client';
import { MEDIA_URL, WS_URL } from '@/config';
import { useCRUD } from '@/hooks/useCrud';
import { formatTime } from '@/lib/formatDate';
import { useAuthService } from '@/services/AuthService';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';

interface MessageProps {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export function MessageInterface({
  discussionUUID,
}: {
  discussionUUID: string;
}) {
  const { logout, userInfo, refreshAccessToken } = useAuthService();
  const formRef = useRef<HTMLFormElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [newMessage, setNewMessage] = useState<MessageProps[]>([]); // 保存从后端返回的 message
  const [message, setMessage] = useState(''); // 保存用户输入的 message
  const { fetchData, dataCRUD, isLoading, error } = useCRUD<MessageProps>(
    [],
    `/message/?channel_uuid=${discussionUUID}`,
  );

  const socketUrl = discussionUUID ? WS_URL + `/ws/${discussionUUID}/` : null;

  const [reconnectionAttempt, setReconnectionAttempt] = useState(0);
  const maxConnectionAttempts = 20;

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: async () => {
      try {
        const data = await fetchData();
        setNewMessage([]);
        setNewMessage(Array.isArray(data) ? data : []);
        console.log('Connected to: ' + socketUrl);
      } catch (error) {
        console.error(error);
      }
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
      setReconnectionAttempt((prevAttempt) => prevAttempt + 1);
    },
    onError: () => console.log('error'),
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      setNewMessage((prev) => [...prev, data.new_message]); // 从后端返回的 message 保存在 data.new_message 中
    },
    shouldReconnect: (closeEvent) => {
      if (
        closeEvent.code === 4001 &&
        reconnectionAttempt >= maxConnectionAttempts
      ) {
        setReconnectionAttempt(0);
        return false;
      }
      return true;
    },
    reconnectInterval: 1000,
  });
  //   const { lastJsonMessage, sendMessage } = useWebSocket(socketUrl);

  // 当 newMessage 更新时，自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(); // { behavior: 'smooth' }
  }, [newMessage]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        144,
      )}px`;
    }
  }, [message]);

  const sendMessage = () => {
    if (!message) return;
    sendJsonMessage({ type: 'message', message });
    setMessage('');
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      // 检查是否按下了 Shift 键，如果按下了 Shift 键，则允许换行
      if (!event.shiftKey) {
        // 阻止默认行为（换行）
        event.preventDefault();
        // 发送消息逻辑

        sendMessage();
      }
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="w-full flex-1 overflow-y-auto overflow-x-hidden pr-4">
        {newMessage.map((msg) => (
          <div
            className={clsx(
              'mt-8 flex w-full items-start gap-x-3',
              msg?.sender === userInfo?.username
                ? 'flex-row-reverse'
                : ' flex-row',
            )}
            key={msg?.id}
          >
            <img
              src={MEDIA_URL + msg?.avatar}
              alt="avatar"
              className="h-6 w-6 rounded-md"
            />
            <div
              className={clsx(
                'flex w-full flex-col',
                msg?.sender === userInfo?.username ? ' items-end' : '',
              )}
            >
              <div
                className={clsx(
                  'mb-2 flex items-center justify-start gap-x-4 text-xs',
                  msg?.sender === userInfo?.username ? ' flex-row-reverse' : '',
                )}
              >
                <span className="font-bold">{msg?.sender}</span>
                <span className="">{formatTime(msg?.timestamp)}</span>
              </div>

              <div
                className={clsx(
                  'mb-2 w-fit max-w-[70%] break-words rounded-lg bg-indigo-100 p-2',
                  'dark:bg-indigo-900',
                  msg?.sender === userInfo?.username ? 'flex-row-reverse' : '',
                )}
              >
                {msg?.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="w-full pt-6 lg:pb-2">
        <form
          ref={formRef}
          className="relative flex items-end"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            className="max-h-72 w-full resize-none overflow-auto rounded-lg
        border-2 border-gray-300 border-opacity-50  p-2 pr-12 outline-none transition-all duration-150
        focus:border-opacity-100 dark:border-gray-500 dark:border-opacity-50 dark:bg-transparent dark:focus:border-opacity-100"
            title="message"
            name="message"
            autoComplete="off"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
          />
          <button
            name="send message"
            title="send message"
            className="absolute right-0 flex items-center rounded-lg px-4 py-2
             text-gray-400 transition-colors hover:text-indigo-600 dark:text-gray-500"
            type="submit"
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageInterface;
