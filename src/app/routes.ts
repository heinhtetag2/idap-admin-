import { createBrowserRouter } from 'react-router';
import Layout from './Layout';
import Dashboard from '@/pages/dashboard';
import Surveys from '@/pages/surveys';
import SurveyBuilder from '@/pages/survey-builder';
import SurveyDetail from '@/pages/survey-detail';
import Billing from '@/pages/billing';
import Payouts from '@/pages/payouts';
import Companies from '@/pages/companies';
import CompanyDetail from '@/pages/company-detail';
import Respondents from '@/pages/respondents';
import RespondentDetail from '@/pages/respondent-detail';
import Help from '@/pages/help';
import Settings from '@/pages/settings';
import NotFound from '@/pages/not-found';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'dashboard', Component: Dashboard },
      { path: 'surveys', Component: Surveys },
      { path: 'surveys/new', Component: SurveyBuilder },
      { path: 'surveys/:id', Component: SurveyDetail },
      { path: 'companies', Component: Companies },
      { path: 'companies/:id', Component: CompanyDetail },
      { path: 'respondents', Component: Respondents },
      { path: 'respondents/:id', Component: RespondentDetail },
      { path: 'billing', Component: Billing },
      { path: 'payouts', Component: Payouts },
      { path: 'help', Component: Help },
      { path: 'settings', Component: Settings },
      { path: '*', Component: NotFound },
    ],
  },
]);
