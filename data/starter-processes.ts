export interface StarterProcess {
  key: string;
  name: string;
  value_stream: 'Strategy2Portfolio' | 'Requirement2Deploy' | 'Request2Fulfill' | 'Detect2Correct';
}

export const starterProcesses: StarterProcess[] = [
  {
    key: 'S2P.01',
    name: 'Strategy & Portfolio Planning',
    value_stream: 'Strategy2Portfolio',
  },
  {
    key: 'R2D.01',
    name: 'Plan & Build',
    value_stream: 'Requirement2Deploy',
  },
  {
    key: 'R2F.01',
    name: 'Request Fulfillment',
    value_stream: 'Request2Fulfill',
  },
  {
    key: 'D2C.01',
    name: 'Detect & Correct',
    value_stream: 'Detect2Correct',
  },
  {
    key: 'BAI09',
    name: 'Manage Assets',
    value_stream: 'Requirement2Deploy',
  },
  {
    key: 'DSS01',
    name: 'Manage Operations',
    value_stream: 'Request2Fulfill',
  },
  {
    key: 'DSS02',
    name: 'Manage Service Requests and Incidents',
    value_stream: 'Request2Fulfill',
  },
  {
    key: 'APO13',
    name: 'Manage Security',
    value_stream: 'Detect2Correct',
  },
];
