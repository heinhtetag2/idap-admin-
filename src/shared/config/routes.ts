export const routes = {
  root: '/',

  auth: {
    login: '/auth/login',
    registerRespondent: '/auth/register/respondent',
    registerCompany: '/auth/register/company',
  },

  client: {
    root: '/client',
    dashboard: '/client/dashboard',
    surveys: '/client/surveys',
    surveyDetail: (id: string) => `/client/surveys/${id}`,
    surveyBuilder: (id: string) => `/client/surveys/${id}/build`,
    analytics: '/client/analytics',
    billing: '/client/billing',
    billingDetail: (id: string) => `/client/billing/${id}`,
    notifications: '/client/notifications',
    settings: '/client/settings',
    login: '/client/login',
  },

  respondent: {
    root: '/respondent',
    feed: '/respondent/feed',
    surveyDetail: (id: string) => `/respondent/surveys/${id}`,
    surveyPlayer: (id: string) => `/respondent/surveys/${id}/play`,
    surveyComplete: (id: string) => `/respondent/surveys/${id}/complete`,
    history: '/respondent/history',
    wallet: '/respondent/wallet',
    walletHistory: '/respondent/wallet/history',
    notifications: '/respondent/notifications',
    settings: '/respondent/settings',
  },

  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    companies: '/admin/companies',
    respondents: '/admin/respondents',
    surveys: '/admin/surveys',
    fraud: '/admin/fraud',
    payouts: '/admin/payouts',
    notifications: '/admin/notifications',
    settings: '/admin/settings',
    login: '/admin/login',
  },

  marketing: {
    about: '/about',
  },
} as const;
