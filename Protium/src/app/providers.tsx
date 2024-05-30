'use client';

import { AuthServiceProvider } from '@/context/AuthContext';

import { ThemeProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';

import store from '@/app/store';
import '@/i18n/i18n';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <AuthServiceProvider>
        <ThemeProvider attribute="class" disableTransitionOnChange={true}>
          {children}
        </ThemeProvider>
      </AuthServiceProvider>
    </ReduxProvider>
  );
};

export default Provider;
