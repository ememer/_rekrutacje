/* eslint-disable @typescript-eslint/no-unused-vars */
const API_KEY = 'Do-6dFFzyJeN6bfWULQxLu9cEICFZHNpJoPcuzy3U1w';

import * as React from 'react';

export const DisplayMapClass = ({ lat = 50, lng = 50 }) => {
  console.log(lat, lng);

  // Create a reference to the HTML element we want to put the map on
  const mapRef = React.useRef(null);

  /**
   * Create the map instance
   * While `useEffect` could also be used here, `useLayoutEffect` will render
   * the map sooner
   */
  React.useLayoutEffect(() => {
    // `mapRef.current` will be `undefined` when this hook first runs; edge case that
    if (!mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const H = window.H;
    const platform = new H.service.Platform({
      apikey: API_KEY,
    });
    const defaultLayers = platform.createDefaultLayers();
    const hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: { lat: lat, lng: lng },
      zoom: 15,
      pixelRatio: window.devicePixelRatio || 1,
    });

    // eslint-disable-next-line no-unused-vars
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));

    // eslint-disable-next-line no-unused-vars
    const ui = H.ui.UI.createDefault(hMap, defaultLayers);

    // This will act as a cleanup to run once this hook runs again.
    // This includes when the component un-mounts
    return () => {
      hMap.dispose();
    };
  }, [mapRef, lat, lng]); // This will run this hook every time this ref is updated

  return <div className="map" ref={mapRef} style={{ height: '500px' }} />;
};
