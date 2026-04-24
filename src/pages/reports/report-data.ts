export type ReportStatus = 'New' | 'Under review' | 'Resolved' | 'Dismissed';
export type ReportSeverity = 'Low' | 'Medium' | 'High';
export type ReportReason =
  | 'Harassment'
  | 'Misleading survey'
  | 'Non-payment'
  | 'Privacy violation'
  | 'Spam'
  | 'Other';
export type ReportResolution = 'Dismissed' | 'Warned' | 'Suspended' | 'Escalated';

export type Report = {
  id: string;
  companyId: string;
  companyName: string;
  companyInitial: string;
  respondentId: string;
  respondentName: string;
  respondentInitial: string;
  surveyId?: string;
  surveyTitle?: string;
  reason: ReportReason;
  severity: ReportSeverity;
  status: ReportStatus;
  description: string;
  submittedAt: string;
  resolvedAt?: string;
  resolution?: ReportResolution;
};

export const DEMO_REPORTS: Report[] = [
  {
    id: 'rp-001',
    companyId: 'co-007',
    companyName: 'Nomin Holdings',
    companyInitial: 'N',
    respondentId: 'rs-010',
    respondentName: 'Bold Chinzorig',
    respondentInitial: 'B',
    surveyId: 'sur-003',
    surveyTitle: 'Retail Experience Feedback',
    reason: 'Non-payment',
    severity: 'High',
    status: 'New',
    description:
      'I completed the survey on April 18 and got an "Accepted" email, but the reward was never credited to my balance. I\'ve waited 5 days.',
    submittedAt: '2026-04-23T09:12:00',
  },
  {
    id: 'rp-002',
    companyId: 'co-007',
    companyName: 'Nomin Holdings',
    companyInitial: 'N',
    respondentId: 'rs-014',
    respondentName: 'Dorj Munkhtuya',
    respondentInitial: 'D',
    surveyId: 'sur-003',
    surveyTitle: 'Retail Experience Feedback',
    reason: 'Non-payment',
    severity: 'High',
    status: 'New',
    description:
      'Same issue as other respondents — rewards for Nomin surveys are never paid out. This is the third survey from them I have not been paid for.',
    submittedAt: '2026-04-22T17:40:00',
  },
  {
    id: 'rp-003',
    companyId: 'co-002',
    companyName: 'Mongolian Telecom',
    companyInitial: 'M',
    respondentId: 'rs-007',
    respondentName: 'Otgon Tsegmid',
    respondentInitial: 'O',
    surveyId: 'sur-005',
    surveyTitle: 'Mobile Network Satisfaction',
    reason: 'Misleading survey',
    severity: 'Medium',
    status: 'Under review',
    description:
      'The survey asked for my exact home address and ID number, which was not mentioned in the description before I started.',
    submittedAt: '2026-04-21T11:05:00',
  },
  {
    id: 'rp-004',
    companyId: 'co-002',
    companyName: 'Mongolian Telecom',
    companyInitial: 'M',
    respondentId: 'rs-002',
    respondentName: 'Oyuntsetseg Bayar',
    respondentInitial: 'O',
    surveyId: 'sur-005',
    surveyTitle: 'Mobile Network Satisfaction',
    reason: 'Privacy violation',
    severity: 'High',
    status: 'Under review',
    description:
      'They requested a photo of my national ID inside the survey. I have not shared it but this should not be allowed.',
    submittedAt: '2026-04-21T14:22:00',
  },
  {
    id: 'rp-005',
    companyId: 'co-005',
    companyName: 'APU Company',
    companyInitial: 'A',
    respondentId: 'rs-013',
    respondentName: 'Bayarmaa Tserendorj',
    respondentInitial: 'B',
    surveyId: 'sur-002',
    surveyTitle: 'Beverage Preference Study',
    reason: 'Spam',
    severity: 'Low',
    status: 'New',
    description:
      'After completing one survey, I started receiving marketing emails from APU even though I didn\'t subscribe.',
    submittedAt: '2026-04-22T08:30:00',
  },
  {
    id: 'rp-006',
    companyId: 'co-001',
    companyName: 'MCS Group',
    companyInitial: 'M',
    respondentId: 'rs-005',
    respondentName: 'Narantuya Tseren',
    respondentInitial: 'N',
    reason: 'Other',
    severity: 'Low',
    status: 'Resolved',
    description:
      'Survey took 45 minutes to complete but was advertised as a 10-minute survey. Reward was not proportional to the effort.',
    submittedAt: '2026-04-15T10:00:00',
    resolvedAt: '2026-04-17T14:30:00',
    resolution: 'Warned',
  },
  {
    id: 'rp-007',
    companyId: 'co-011',
    companyName: 'TDB Bank',
    companyInitial: 'T',
    respondentId: 'rs-009',
    respondentName: 'Saruul Enkhbayar',
    respondentInitial: 'S',
    surveyId: 'sur-004',
    surveyTitle: 'Digital Banking Preferences',
    reason: 'Harassment',
    severity: 'Medium',
    status: 'Under review',
    description:
      'Their support agent contacted me privately after I gave a low satisfaction rating, asking me to change my answer.',
    submittedAt: '2026-04-20T16:48:00',
  },
  {
    id: 'rp-008',
    companyId: 'co-003',
    companyName: 'Khan Bank',
    companyInitial: 'K',
    respondentId: 'rs-016',
    respondentName: 'Khulan Batsaikhan',
    respondentInitial: 'K',
    reason: 'Misleading survey',
    severity: 'Low',
    status: 'Dismissed',
    description:
      'The description said 5,000 MNT reward but I only received 500 MNT.',
    submittedAt: '2026-04-10T09:15:00',
    resolvedAt: '2026-04-12T11:00:00',
    resolution: 'Dismissed',
  },
  {
    id: 'rp-009',
    companyId: 'co-007',
    companyName: 'Nomin Holdings',
    companyInitial: 'N',
    respondentId: 'rs-019',
    respondentName: 'Ulzii Dashnyam',
    respondentInitial: 'U',
    reason: 'Non-payment',
    severity: 'High',
    status: 'New',
    description:
      'Not paid for two surveys completed last week. No response from company when I reached out.',
    submittedAt: '2026-04-23T19:55:00',
  },
  {
    id: 'rp-010',
    companyId: 'co-008',
    companyName: 'Mobicom Corp',
    companyInitial: 'M',
    respondentId: 'rs-008',
    respondentName: 'Oyunchimeg Bold',
    respondentInitial: 'O',
    reason: 'Spam',
    severity: 'Low',
    status: 'Resolved',
    description:
      'Received a promotional SMS from Mobicom after completing their survey. I had not opted in.',
    submittedAt: '2026-04-08T13:20:00',
    resolvedAt: '2026-04-10T09:45:00',
    resolution: 'Warned',
  },
];

export function findReportById(id: string): Report | undefined {
  return DEMO_REPORTS.find((r) => r.id.toLowerCase() === id.toLowerCase());
}

export function getReportsByCompanyId(companyId: string): Report[] {
  return DEMO_REPORTS.filter(
    (r) => r.companyId.toLowerCase() === companyId.toLowerCase(),
  );
}

export function countOpenReportsByCompanyId(companyId: string): number {
  return DEMO_REPORTS.filter(
    (r) =>
      r.companyId.toLowerCase() === companyId.toLowerCase() &&
      (r.status === 'New' || r.status === 'Under review'),
  ).length;
}
