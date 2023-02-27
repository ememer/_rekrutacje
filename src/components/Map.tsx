/* eslint-disable @typescript-eslint/no-unused-vars */
const API_KEY = 'Do-6dFFzyJeN6bfWULQxLu9cEICFZHNpJoPcuzy3U1w';

import React, { useEffect, useState } from 'react';

import H from '@here/maps-api-for-javascript';

interface Props {
  lat: number;
  lng: number;
  destLat: number;
  destLng: number;
}
export const Map = ({ lat = 0, lng = 0, destLat = 0, destLng = 0 }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  //Init map with references
  const mapRef = React.useRef(null);

  useEffect(() => {
    const platform = new H.service.Platform({
      apikey: API_KEY,
    });
    if (!mapRef.current) return;
    const defaultLayers = platform.createDefaultLayers();

    const hMap = new H.Map(mapRef.current, (defaultLayers as any)?.vector?.normal?.map, {
      zoom: 7,
      center: { lat: lat, lng: lng },
      pixelRatio: window.devicePixelRatio || 1,
    });

    const routingParameters = {
      routingMode: 'fast',
      transportMode: 'car',
      origin: `${lat},${lng}`,
      destination: `${destLat},${destLng}`,
      return: 'polyline',
    };

    const onResult = function (result: any) {
      if (result.routes.length) {
        result.routes[0].sections.forEach((section: any) => {
          // Create a linestring to use as a point source for the route line
          const linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

          // Create a polyline to display the route:
          const routeLine = new H.map.Polyline(linestring, {
            style: { strokeColor: 'blue', lineWidth: 3 },
          } as any);

          // Create a marker for the start point:
          const startMarker = new H.map.Marker(section.departure.place.location);

          // Create a marker for the end point:
          const endMarker = new H.map.Marker(section.arrival.place.location);

          // Add the route polyline and the two markers to the map:
          hMap.addObjects([routeLine, startMarker, endMarker]);

          // Set the map's viewport to make the whole route visible:
          (hMap as any)
            .getViewModel()
            .setLookAtData({ bounds: routeLine.getBoundingBox() } as any);
        });
        setIsLoaded(true);
      }
    };

    new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Unreachable code error
    const router = platform.getRoutingService(null, 8);
    router.calculateRoute(routingParameters, onResult, function (error) {
      alert(error.message);
    });

    return () => {
      hMap.dispose();
    };
  }, [lat, lng, destLat, destLng, isLoaded]);

  return (
    <>
      {!isLoaded ? (
        <div className="flex justify-center items-center p-2">
          <svg className="animate-spin h-5 w-5 mr-3 bg-blue-300" />
          <h1>Trwa ładowanie...</h1>
        </div>
      ) : null}
      <div className="map w-full" ref={mapRef} style={{ height: '450px' }} />
    </>
  );
};
