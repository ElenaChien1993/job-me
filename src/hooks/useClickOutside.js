const useClickOutside = (ref, callback) => {
  document.addEventListener('click', (e) => {
    // console.log(e.target, e.currentTarget)
    if (e.target.contains(ref.current)) {
      console.log('click')
      return callback();
    }
  });
};

export default useClickOutside;
