const useClickOutside = (ref, callback) => {
  document.addEventListener('click', (e) => {
    if (e.target.contains(ref.current)) {
      console.log('click')
      return callback();
    }
  });
};

export default useClickOutside;
