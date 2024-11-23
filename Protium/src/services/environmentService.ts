// import { WS_URL } from '@/config';
// import { useState } from 'react';
// import useWebSocket from 'react-use-websocket';

// const useEnvironmentWebSocket = (params: { uuid: string }) => {
//   const [isError, setIsError] = useState(false);
//   const [socketUrl, setSocketUrl] = useState(
//     params.uuid ? WS_URL + `/ws/environment/${params.uuid}/` : null,
//   );

//   const { sendJsonMessage, sendMessage, getWebSocket, readyState } =
//     useWebSocket(socketUrl, {
//       onOpen: () => {
//         console.log('Connected to: ' + socketUrl);
//       },
//       onClose: (event: CloseEvent) => {
//         console.log('Close Event', event);
//       },
//       onError: () => {
//         console.log('Error');
//       },
//       onMessage: (event: MessageEvent) => {
//         console.log('Message', event);
//       },
//     });

//   return { sendJsonMessage, isError, sendMessage, getWebSocket, readyState };
// };

// export default useEnvironmentWebSocket;
