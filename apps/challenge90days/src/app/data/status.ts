export enum Status {
  BASIC = 'basic',
  PRIMARY = 'primary',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
}

export const STATUS_LIST = [
  {
    text: '無',
    value: '',
  },
  {
    text: '深藍',
    value: 'primary',
  },
  {
    text: '淺藍',
    value: 'info',
  },
  {
    text: '橘',
    value: 'warning',
  },
  {
    text: '紅',
    value: 'danger',
  },
];
