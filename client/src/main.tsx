import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App';

const queryClient = new QueryClient();

const container = document.getElementById('root')!;
createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <SpeedInsights />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
