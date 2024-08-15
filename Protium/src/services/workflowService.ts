import { RootReducerProps } from '@/app/store';
import { BASE_URL, WS_URL } from '@/config';
import useAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { useAuthService } from '@/services/AuthService';
import {
  setNodeExecutedCompile,
  setWorkflow,
} from '@/store/workflow/workflowSlice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket from 'react-use-websocket';

const useWorkflowWebSocket = (params: { uuid: string }) => {
  const jwtAxios = useAxiosWithInterceptors();
  const { logout, userInfo, refreshAccessToken } = useAuthService();

  const [isLoading, setIsLoading] = useState(true);
  const [socketUrl, setSocketUrl] = useState(
    params.uuid ? WS_URL + `/ws/workflow/${params.uuid}/` : null,
  );

  const dispatch = useDispatch();
  const { workflow, nodes, edges, consoleInfo } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );

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
            setNodeExecutedCompile({
              id: data.execute_status.uuid,
              header: data.execute_status.header,
              status: data.execute_status.status,
              compile: data.execute_status.compile,
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

  const saveWorkflow = async () => {
    
    // 每次保存的时候，打印一下当前的 workflow 数据
    console.log('>>>>', {
      ...workflow,
      nodes,
      edges,
    });

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

  return {
    isLoading,
    sendJsonMessage,
    sendMessage,
    getWebSocket,
    readyState,
    saveWorkflow,
    startWorkflow,
  };
};

export default useWorkflowWebSocket;
