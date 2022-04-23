const useFormatedTime = date => {
  const timeString = `${date.toDate().toLocaleDateString(undefined, {
    month: 'numeric',
    day: 'numeric',
  })} ${date.toDate().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;

  return timeString;
};

export default useFormatedTime;
