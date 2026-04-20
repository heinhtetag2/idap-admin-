import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './app/App.tsx';
import { createQueryClient } from './shared/lib/query-client';
import { env } from './shared/config/env';
import './styles/index.css';

const queryClient = createQueryClient();

async function bootstrap() {
  if (env.isDev && env.useMockApi) {
    const { worker } = await import('./shared/api/msw/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <App />
      {env.isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>,
  );
}

bootstrap();
