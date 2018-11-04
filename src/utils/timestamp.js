import { format } from 'date-fns';

const DATE_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss A';

export const formatTimestamp = (time) => format(
  time,
  DATE_FORMAT,
);