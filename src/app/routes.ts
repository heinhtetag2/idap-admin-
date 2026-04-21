import { createBrowserRouter } from 'react-router';
import Layout from './Layout';
import Dashboard from '@/pages/dashboard';
import Expenses from '@/pages/expenses';
import ExpenseDetail from '@/pages/expense-detail';
import Funding from '@/pages/funding';
import FundingDetail from '@/pages/funding-detail';
import Surveys from '@/pages/surveys';
import SurveyBuilder from '@/pages/survey-builder';
import SurveyDetail from '@/pages/survey-detail';
import Templates from '@/pages/templates';
import Scribe from '@/pages/scribe';
import Settings from '@/pages/settings';
import EmployeeManagement from '@/pages/employees';
import Billing from '@/pages/billing';
import Help from '@/pages/help';
import NotFound from '@/pages/not-found';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'dashboard', Component: Dashboard },
      { path: 'templates', Component: Templates },
      { path: 'evidence', Component: Scribe },
      { path: 'tasks', Component: Scribe },
      { path: 'scribe', Component: Scribe },
      { path: 'community/templates', Component: Templates },
      { path: 'team', Component: Templates },
      { path: 'settings', Component: Settings },
      { path: 'help', Component: Help },
      { path: 'notifications', Component: Templates },
      { path: 'funding', Component: Funding },
      { path: 'funding/:id', Component: FundingDetail },
      { path: 'surveys', Component: Surveys },
      { path: 'surveys/new', Component: SurveyBuilder },
      { path: 'surveys/:id', Component: SurveyDetail },
      { path: 'expenses', Component: Expenses },
      { path: 'expenses/:id', Component: ExpenseDetail },
      { path: 'payroll', Component: Templates },
      { path: 'billing', Component: Billing },
      { path: 'employee-management', Component: EmployeeManagement },
      { path: 'budget-management', Component: Templates },
      { path: 'monthly-closing', Component: Templates },
      { path: 'statistical-reports', Component: Templates },
      { path: 'exchange-rates', Component: Templates },
      { path: '*', Component: NotFound },
    ],
  },
]);
