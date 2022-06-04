import PropTypes from 'prop-types';

const useClickOutside = (ref, callback) => {
  document.addEventListener('click', e => {
    if (e.target.contains(ref.current)) {
      return callback();
    }
  });
};

useClickOutside.propTypes = {
  ref: PropTypes.object,
  callback: PropTypes.func,
};

export default useClickOutside;
