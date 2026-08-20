import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import TailorPage from './pages/TailorPage';
import RecruiterPage from './pages/RecruiterPage';
import RoleGuard from './components/RoleGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/analyze',
    element: <RoleGuard allowedRole={['candidate', 'interviewer']}><AnalyzePage /></RoleGuard>,
  },
  {
    path: '/results/:sessionId',
    element: <RoleGuard allowedRole="candidate"><ResultsPage /></RoleGuard>,
  },
  {
    path: '/tailor/:sessionId',
    element: <RoleGuard allowedRole="candidate"><TailorPage /></RoleGuard>,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/recruiter',
    element: <RoleGuard allowedRole="interviewer"><RecruiterPage /></RoleGuard>,
  },
  {
    path: '/recruiter/:sessionId',
    element: <RoleGuard allowedRole="interviewer"><RecruiterPage /></RoleGuard>,
  }
]);
