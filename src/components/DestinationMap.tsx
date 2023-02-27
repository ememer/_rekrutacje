import React, { useContext, useEffect, useState } from 'react';

import { ApiResponseContext } from '../Context/ApiResponseContext';
import { AutoCompleteContext } from '../Context/AutoCompleteContext';
import { useApiResponse } from '../Hook/useApiResponse';
import { ApiResponseContextType } from '../Types/ApiResponseContextTypes';
import {
  AutoCompleteContextTypes,
  DEF_STATE_TYPE,
} from '../Types/AutoCompleteContextTypes';

import CreatePdf from './CreatePdf';

const API_KEY = 'Do-6dFFzyJeN6bfWULQxLu9cEICFZHNpJoPcuzy3U1w';

import { Map } from './Map';

const getGeoCode = async (targetAddress: DEF_STATE_TYPE) => {
  const URL = ' https://geocode.search.hereapi.com/v1/geocode?q=';
  const addressUrl = encodeURIComponent(
    `${targetAddress?.address} ${targetAddress?.number} ${targetAddress?.city}`,
  );
  const response = await fetch(`${URL}${addressUrl}&apiKey=${API_KEY}`);

  if (!response.ok) {
    return;
  }
  const json = await response.json();
  return json?.items;
};

const DestinationMap = () => {
  const { destination, originDestination } = useContext(
    AutoCompleteContext,
  ) as AutoCompleteContextTypes;
  const { setErrorMessage } = useContext(ApiResponseContext) as ApiResponseContextType;
  const [routeDistance, setRouteDistance] = useState<number>(0);
  const [pricePerKm, setPricePerKm] = useState<number | string>(1.2);
  const [validateError, setValidateError] = useState(false);
  const [routeStepByStep, setRouteStepByStep] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [startPoint, setStartPoint] = useState({
    lat: 50,
    lng: 50,
  });
  const [destPoint, setDestPoint] = useState({
    lat: 0,
    lng: 0,
  });

  // Fetch route

  useEffect(() => {
    const calculateRoute = async () => {
      const originDestinationLoc = await getGeoCode(originDestination);
      const destinationLoc = await getGeoCode(destination);
      setStartPoint({
        lat: originDestinationLoc[0].position?.lat,
        lng: originDestinationLoc[0].position?.lng,
      });
      setDestPoint({
        lat: destinationLoc[0].position?.lat,
        lng: destinationLoc[0].position?.lng,
      });
      const response = await fetch(
        `https://router.hereapi.com/v8/routes?transportMode=car&origin=${originDestinationLoc[0].position?.lat},${originDestinationLoc[0].position?.lng}&destination=${destinationLoc[0].position?.lat},${destinationLoc[0].position?.lng}&return=summary,polyline,turnbyturnactions&apikey=${API_KEY}`,
      );
      if (!response.ok) {
        const isErrorOccurred = useApiResponse(response);
        setErrorMessage(isErrorOccurred);
      }
      const json = await response.json();

      setRouteStepByStep(json?.routes[0]?.sections[0]?.turnByTurnActions);
      setRouteDistance(json?.routes[0]?.sections[0]?.summary?.length);
      const timeoutId = setTimeout(() => {
        setIsLoaded(true);
      }, 1200);
      return () => clearTimeout(timeoutId);
    };
    calculateRoute();
  }, [originDestination, destination]);

  // Calculate price per km

  const calculatePrice = () => {
    const price = ((routeDistance as number) / 1000) * +pricePerKm * 1.1;
    return +parseFloat(`${price}`).toFixed(2);
  };

  // Counting daily trip ability

  const dailyTripAbility = (distance: number, sumPrice: number) => {
    if ((distance as number) / 1000 / 800 > 1 || sumPrice / 1000 > 1) {
      if (Math.ceil(sumPrice / 1000) > Math.ceil((distance as number) / 1000 / 800)) {
        const tripInDays = Math.ceil(sumPrice / 1000);
        return tripInDays;
      }
      const tripInDays = Math.ceil((distance as number) / 1000 / 800);
      return tripInDays;
    }
    return 1;
  };

  // Validate input price

  const validatePrice = (e: React.ChangeEvent) => {
    setValidateError(false);
    const re = /^\d*\.?\d*$/;
    //Replacing comma char with a dot
    const value = (e.target as HTMLInputElement).value.replace(/,/g, '.');
    // Checking is value number
    const isNumber = re.test(value);
    if (isNumber) {
      if (value === '0') {
        setPricePerKm(1);
        return;
      }
      // Protected before set negative values
      if (value.includes('-')) {
        setPricePerKm(value.replaceAll('-', ''));
        return;
      }
      setPricePerKm(value);
      return;
    }
    setValidateError(true);
    return;
  };

  // Set or update storage

  useEffect(() => {
    const storage = sessionStorage;
    const newStorageItem = [originDestination, destination];
    if (storage.getItem('routes')) {
      const prevStorage = JSON.parse(storage.getItem('routes') as string);
      storage.setItem('routes', JSON.stringify([...prevStorage, newStorageItem]));
      return;
    }
    storage.setItem('routes', JSON.stringify([newStorageItem]));
  }, []);

  return (
    <>
      {!isLoaded ? (
        <div className="fixed top-0 left-0 w-full min-h-screen bg-white p-4 flex justify-center">
          <div className="flex justify-center items-center p-2">
            <svg className="animate-spin h-5 w-5 mr-3 bg-blue-300" />
            <h1>Trwa ładowanie...</h1>
          </div>
        </div>
      ) : (
        <CreatePdf>
          <div>
            <div className="w-3/4 p-4">
              <Map
                lat={startPoint.lat}
                lng={startPoint.lng}
                destLat={destPoint.lat}
                destLng={destPoint.lng}
              />
            </div>
            <div className="w-3/4">
              <div className="w-full my-2 mx-auto flex flex-col">
                <h2 className="w-full">Ustaw stawkę za 1km</h2>
                <input
                  className="border border-blue-300 w-1/4 rounded-md p-2 px-4 my-2"
                  value={pricePerKm}
                  onChange={(e) => validatePrice(e)}
                  placeholder="Stawka za km"
                />
                {validateError && (
                  <span className="w-full text-red-300">Podaj prawidłową wartość!</span>
                )}
              </div>
              <div className="w-full flex justify-between">
                <div className="w-1/4">
                  <h2>Trase pokonasz w:</h2>
                  {`${dailyTripAbility(routeDistance as number, calculatePrice())} ${
                    dailyTripAbility(routeDistance as number, calculatePrice()) === 1
                      ? 'dzień'
                      : 'dni'
                  }`}
                </div>
                <div className="w-1/4">
                  <h2>Koszt:</h2>
                  {`${calculatePrice()} PLN`}
                </div>
                <div className="w-1/4">
                  <h2>Dystans:</h2>
                  {`${parseFloat(`${routeDistance / 1000}`).toFixed(2)} km`}
                </div>
              </div>
              <div>
                <ul className=" shadow-sm p-2 px-4 my-4">
                  {routeStepByStep &&
                    routeStepByStep.map((steps, idx) => (
                      <li className="bg-blue-300 p-2 my-4 rounded-md" key={idx}>
                        <div className="flex items-center">
                          <h2 className="p-2">Krok: {steps.action}</h2>
                          <span className="ml-4">Kierunek: {steps?.direction}</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-md">
                          {steps?.currentRoad?.name && (
                            <div className="w-full p-4">
                              <span>Aktualna droga:</span>
                              {steps?.currentRoad?.name && (
                                <h2>{steps?.currentRoad?.name[0].value}</h2>
                              )}
                            </div>
                          )}
                          {steps?.nextRoad?.name && (
                            <div className="pl-6 p-4 bg-blue-50 rounded-md">
                              <span>Kieruj się:</span>
                              {steps?.nextRoad?.name && (
                                <h2>{steps?.nextRoad?.name[0].value}</h2>
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </CreatePdf>
      )}
    </>
  );
};

export default DestinationMap;
