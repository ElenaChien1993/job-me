export const initMap = async (setValues, inputRef) => {

  const options = {
    fields: ['formatted_address'],
    strictBounds: false,
    types: ['establishment'],
  };

  const autocomplete = new window.google.maps.places.Autocomplete(
    inputRef.current,
    options
  );

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    setValues(prev => {
      return { ...prev, address: place.formatted_address };
    });
  });
};
