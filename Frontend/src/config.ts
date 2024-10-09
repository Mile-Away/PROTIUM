import dotenv from 'dotenv';

dotenv.config();

enum Environment {
  Bohrium = 'Bohrium',
  Protium = 'Protium',
}

export const ENV: Environment = Environment.Protium;

export const IS_CLIENT = typeof window !== 'undefined';

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? IS_CLIENT
      ? 'http://127.0.0.1:8000/api'
      : 'http://backend:8000/api'
    : process.env.NEXT_PUBLIC_BASE_URL || 'https://service.protium.space/api';

export const MEDIA_URL =
  process.env.NODE_ENV === 'development'
    ? IS_CLIENT
      ? 'http://127.0.0.1:8000'
      : 'http://backend:8000'
    : process.env.NEXT_PUBLIC_MEDIA_URL || 'https://service.protium.space';

export const WS_URL =
  process.env.NODE_ENV === 'development'
    ? IS_CLIENT
      ? 'ws://127.0.0.1:8000'
      : 'ws://backend:8000'
    : process.env.NEXT_PUBLIC_WS_URL || 'wss://service.protium.space';

export const PrimarySite =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:3000'
    : process.env.NEXT_PUBLIC_PRIMARY_SITE || 'https://protium.space';

export const DocumentSite =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:4000'
    : process.env.NEXT_PUBLIC_DOCUMENT_SITE ||
      'https://tutorials.protium.space';

export const WorkflowSite =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:3003'
    : process.env.NEXT_PUBLIC_WORKFLOW_SITE ||
      'https://workflows.protium.space';
