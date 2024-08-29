// export const DOCKER_URL =
//   process.env.NODE_ENV === 'development'
//     ? 'http://server:8000/api'
//     : 'http://server:8000/api';

// export const BASE_URL =
//   process.env.NODE_ENV === 'development'
//     ? 'http://127.0.0.1:8000/api'
//     : 'http://127.0.0.1:8000/api';
export const IS_CLIENT = typeof window !== 'undefined';

export const BASE_URL = IS_CLIENT
  ? 'http://127.0.0.1:8000/api'
  : 'http://server:8000/api';

export const MEDIA_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : 'http://127.0.0.1:8000';

export const WS_URL =
  process.env.NODE_ENV === 'development'
    ? 'ws://127.0.0.1:8000'
    : 'ws://127.0.0.1:8000';

export const PrimarySite =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:3000'
    : 'http://127.0.0.1:3000';

export const DocumentSite =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:4000'
    : 'http://127.0.0.1:4000';

export const WorkflowSite =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:3003'
    : 'http://127.0.0.1:3003';
