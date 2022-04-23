import { formatRelative } from 'date-fns';
import { zhTW } from 'date-fns/locale';

const useRelativeTime = (room) => {
  if (room.latest.timestamp === '') return;
  const timeRelative = formatRelative(
    new Date(room.latest.timestamp.seconds * 1000),
    new Date(),
    { locale: zhTW, addSuffix: true }
  );
  return timeRelative;
};

export default useRelativeTime;
