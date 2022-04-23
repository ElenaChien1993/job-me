import { formatRelative } from 'date-fns';
import { zhTW } from 'date-fns/locale';

const useFormatedTime = (room) => {
  if (room.latest_timestamp === '') return;
  const timeRelative = formatRelative(
    new Date(room.latest_timestamp.seconds * 1000),
    new Date(),
    { locale: zhTW, addSuffix: true }
  );
  return timeRelative;
};

export default useFormatedTime;
