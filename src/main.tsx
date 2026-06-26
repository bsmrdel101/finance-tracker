import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRoutes } from 'react-router-dom';
import routes from '~react-pages';
import './styles/index.scss';


const app = createRoot(document.getElementById('root')!);
const queryClient = new QueryClient();
const queryOptions = {
  refetchOnWindowFocus: false,
  keepPreviousData: true
};
queryClient.setDefaultOptions({ queries: queryOptions });

app.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
);

export default function App() {
  return useRoutes(routes);
}
