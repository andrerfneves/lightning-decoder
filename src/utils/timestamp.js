// Timestamp / Date / Time Utilities
import { format } from 'date-fns';

const DATE_FORMAT = 'EEE, dd MMM yyyy HH:mm:ss aa';

export const formatTimestamp = (time) => format(
  time,
  DATE_FORMAT,
);