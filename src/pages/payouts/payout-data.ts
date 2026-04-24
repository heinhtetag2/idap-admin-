export type PayoutStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';
export type PayoutGateway = 'QPay' | 'Bonum' | 'Social Pay' | 'Bank Transfer';

export type PayoutActionLog = {
  action: 'Approved' | 'Rejected' | 'Retried';
  note?: string;
  actor: string;
  actorInitial: string;
  at: string;
};

export type Payout = {
  id: string;
  respondentId: string;
  respondentName: string;
  respondentEmail: string;
  initial: string;
  amountMnt: number;
  gateway: PayoutGateway;
  account: string;
  requestedAt: string;
  status: PayoutStatus;
  lastAction?: PayoutActionLog;
};

export const DEMO_PAYOUTS: Payout[] = [
  { id: 'po-001', respondentId: 'rs-010', respondentName: 'Bold Chinzorig',       respondentEmail: 'user10@example.mn', initial: 'B', amountMnt: 50_000, gateway: 'QPay',          account: '990925930',           requestedAt: '2026-04-20T12:00:00', status: 'Pending' },
  { id: 'po-002', respondentId: 'rs-014', respondentName: 'Dorj Munkhtuya',       respondentEmail: 'user14@example.mn', initial: 'D', amountMnt: 50_000, gateway: 'Bonum',         account: '983245440',           requestedAt: '2026-04-20T19:30:00', status: 'Pending' },
  { id: 'po-003', respondentId: 'rs-007', respondentName: 'Otgon Tsegmid',        respondentEmail: 'user7@example.mn',  initial: 'O', amountMnt: 20_000, gateway: 'QPay',          account: '922699082',           requestedAt: '2026-04-21T08:30:00', status: 'Pending' },
  { id: 'po-004', respondentId: 'rs-013', respondentName: 'Bayarmaa Tserendorj',  respondentEmail: 'user13@example.mn', initial: 'B', amountMnt: 15_000, gateway: 'Bonum',         account: '507962147',           requestedAt: '2026-04-21T07:45:00', status: 'Pending' },
  { id: 'po-005', respondentId: 'rs-008', respondentName: 'Oyunchimeg Bold',      respondentEmail: 'user8@example.mn',  initial: 'O', amountMnt: 15_000, gateway: 'QPay',          account: '956045171',           requestedAt: '2026-04-20T18:00:00', status: 'Pending' },
  { id: 'po-006', respondentId: 'rs-002', respondentName: 'Oyuntsetseg Bayar',    respondentEmail: 'user2@example.mn',  initial: 'O', amountMnt: 30_000, gateway: 'Bank Transfer', account: '507558606',           requestedAt: '2026-04-21T09:00:00', status: 'Pending' },
  { id: 'po-007', respondentId: 'rs-011', respondentName: 'Tuya Munkhjargal',     respondentEmail: 'user11@example.mn', initial: 'T', amountMnt: 75_000, gateway: 'Bank Transfer', account: '5310 **** 7842',     requestedAt: '2026-04-20T14:20:00', status: 'Processing' },
  { id: 'po-008', respondentId: 'rs-019', respondentName: 'Ulzii Dashnyam',       respondentEmail: 'user19@example.mn', initial: 'U', amountMnt: 120_000, gateway: 'QPay',         account: '991122334',           requestedAt: '2026-04-20T10:15:00', status: 'Processing' },
  { id: 'po-009', respondentId: 'rs-005', respondentName: 'Narantuya Tseren',     respondentEmail: 'user5@example.mn',  initial: 'N', amountMnt: 25_000, gateway: 'Social Pay',    account: 'narantuya.t',         requestedAt: '2026-04-19T16:00:00', status: 'Completed' },
  { id: 'po-010', respondentId: 'rs-016', respondentName: 'Khulan Batsaikhan',    respondentEmail: 'user16@example.mn', initial: 'K', amountMnt: 90_000, gateway: 'Bank Transfer', account: '5310 **** 1294',     requestedAt: '2026-04-19T11:30:00', status: 'Completed' },
  { id: 'po-011', respondentId: 'rs-009', respondentName: 'Saruul Enkhbayar',     respondentEmail: 'user9@example.mn',  initial: 'S', amountMnt: 40_000, gateway: 'Social Pay',    account: 'saruul.e',            requestedAt: '2026-04-19T09:10:00', status: 'Completed' },
  { id: 'po-012', respondentId: 'rs-012', respondentName: 'Altangerel Erdene',    respondentEmail: 'user12@example.mn', initial: 'A', amountMnt: 18_000, gateway: 'QPay',          account: '887733221',           requestedAt: '2026-04-18T14:00:00', status: 'Completed' },
  { id: 'po-013', respondentId: 'rs-018', respondentName: 'Tumendemberel Ochir',  respondentEmail: 'user18@example.mn', initial: 'T', amountMnt: 65_000, gateway: 'Social Pay',    account: 'ochir.t',             requestedAt: '2026-04-18T08:00:00', status: 'Completed' },
  { id: 'po-014', respondentId: 'rs-003', respondentName: 'Otgonbayar Baatar',    respondentEmail: 'user3@example.mn',  initial: 'O', amountMnt: 45_000, gateway: 'Bonum',         account: '994455667',           requestedAt: '2026-04-17T19:40:00', status: 'Failed' },
  { id: 'po-015', respondentId: 'rs-006', respondentName: 'Ganbold Sukh',         respondentEmail: 'user6@example.mn',  initial: 'G', amountMnt: 22_000, gateway: 'QPay',          account: '883322110',           requestedAt: '2026-04-17T15:25:00', status: 'Failed' },
  { id: 'po-016', respondentId: 'rs-015', respondentName: 'Enkhjin Purevsuren',   respondentEmail: 'user15@example.mn', initial: 'E', amountMnt: 10_000, gateway: 'Social Pay',    account: 'enkhjin.p',           requestedAt: '2026-04-21T10:05:00', status: 'Pending' },
];
