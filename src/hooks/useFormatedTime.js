import PropTypes from 'prop-types';

const useFormatedTime = date => {
  const timeString = `${new Date(date).toLocaleDateString(undefined, {
    month: 'numeric',
    day: 'numeric',
  })} ${new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;

  return timeString;
};

useFormatedTime.propTypes = {
  date: PropTypes.number.isRequired,
};

export default useFormatedTime;
