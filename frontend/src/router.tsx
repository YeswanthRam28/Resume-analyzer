import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import VideoPage from './pages/VideoPage';
import DashboardPage from './pages/DashboardPage';
import TailorPage from './pages/TailorPage';
import RecruiterPage from './pages/RecruiterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/analyze',
    element: <AnalyzePage />,
  },
  {
    path: '/results/:sessionId',
    element: <ResultsPage />,
  },
  {
    path: '/tailor/:sessionId',
    element: <TailorPage />,
  },
  {
    path: '/video',
    element: <VideoPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/recruiter',
    element: <RecruiterPage />,
  }
]);
