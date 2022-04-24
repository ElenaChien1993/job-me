export const initMap = async query => {
  const taipei = new window.google.maps.LatLng(25.037, 121.564);

  const map = new window.google.maps.Map(document.getElementById('map'), {
    center: taipei,
    zoom: 15,
  });

  const request = {
    query: query,
    fields: ['name', 'formatted_address'],
  };

  const service = new window.google.maps.places.PlacesService(map);

  return new Promise(res => {
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        res(results);
      }
    });
  });
  // let resultsData;
  // return new Promise(res => {
  //   service.textSearch(request, (results, status) => {
  //     if (status === window.google.maps.places.PlacesServiceStatus.OK) {
  //       console.log(results);
  //       res(results);
  //     }
  //   });
  // });
};
