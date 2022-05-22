import { formatRelative } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import PropTypes from 'prop-types';

const useRelativeTime = room => {
  if (room.latest.timestamp === '') return;
  const formatRelativeLocale = {
    lastWeek: "M'月'd'日'",
    yesterday: "'昨天'",
    today: "p",
    other: 'L LT', // Difference: Add time to the date
  };

  const locale = {
    ...zhTW,
    formatRelative: token => formatRelativeLocale[token],
  };

  const timeRelative = formatRelative(
    new Date(room.latest.timestamp.seconds * 1000),
    new Date(),
    { locale }
  );
  return timeRelative;
};

useRelativeTime.propTypes = {
  room: PropTypes.shape({
    latest: PropTypes.object,
  }).isRequired,
};

export default useRelativeTime;
