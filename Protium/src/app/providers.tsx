'use client';

import { AuthServiceProvider } from '@/context/AuthContext';

import store from '@/app/store';
import { StickyProvider } from '@/context/StickyContext';
import '@/i18n/i18n';
import { ThemeProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';
import { ReactFlowProvider } from 'reactflow';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <AuthServiceProvider>
        <ThemeProvider attribute="class" disableTransitionOnChange={true}>
          <StickyProvider>
            <ReactFlowProvider>
              {children}
              </ReactFlowProvider>
          </StickyProvider>
        </ThemeProvider>
      </AuthServiceProvider>
    </ReduxProvider>
  );
};

export default Provider;
