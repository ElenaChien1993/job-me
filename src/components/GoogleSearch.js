export const initMap = async setValues => {
  const input = document.getElementById('autocomplete-input');

  const options = {
    fields: ['formatted_address'],
    strictBounds: false,
    types: ['establishment'],
  };

  const autocomplete = new window.google.maps.places.Autocomplete(
    input,
    options
  );

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    console.log(place);
    setValues(prev => {
      return { ...prev, address: place.formatted_address };
    });
  });
};
