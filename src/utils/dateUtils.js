import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export function formatDate(dateString) {
  return dayjs(dateString).format('MMM DD');
}

export function formatTime(dateString) {
  return dayjs(dateString).format('HH:mm');
}

export function formatDuration(startDate, endDate) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const durаtion = end.diff(start);

  const days = Math.floor(durаtion / (1000 * 60 * 60 * 24));
  const hours = Math.floor((durаtion % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((durаtion % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else {
    return `${minutes}M`;
  }
}
