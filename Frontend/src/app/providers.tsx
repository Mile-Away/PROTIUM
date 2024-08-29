'use client';

import { AuthServiceProvider } from '@/context/AuthContext';
import { StickyProvider } from '@/context/StickyContext';
import { ThemeProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';

import store from '@/app/store';
import '@/i18n/i18n';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <AuthServiceProvider>
        <StickyProvider>
          <ThemeProvider attribute="class" disableTransitionOnChange={true}>
            {children}
          </ThemeProvider>
        </StickyProvider>
      </AuthServiceProvider>
    </ReduxProvider>
  );
};

export default Provider;
