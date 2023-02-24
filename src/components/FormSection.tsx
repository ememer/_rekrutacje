import React, { useContext, useEffect, useState } from 'react';

import { AutoCompleteContext } from '../Context/AutoCompleteContext';
import { useForm } from '../Hook/useForm';
import {
  AutoCompleteContextTypes,
  DEF_STATE_TYPE,
} from '../Types/AutoCompleteContextTypes';

const inputClassName = 'w-full p-2 border rounded-md border-blue-300';
const asterixRequireClassName = 'text-red-300 mr-2 font-bold';
const inputSectionClassName = 'p-4 flex flex-wrap';

const API_KEY = 'Do-6dFFzyJeN6bfWULQxLu9cEICFZHNpJoPcuzy3U1w';

interface Props {
  addressTitle: string;
  cityTitle: string;
  numberTitle: string;
  destinationType: 'originDestination' | 'destination';
}

const FormSection = ({
  addressTitle,
  cityTitle,
  numberTitle,
  destinationType,
}: Props) => {
  const [suggestions, setSuggestions] = useState({
    originDestination: [] as any[],
    destination: [] as any[],
  });
  const { destination, setDestination, originDestination, setOriginDestination } =
    useContext(AutoCompleteContext) as AutoCompleteContextTypes;

  const { validateErrors } = useForm(
    destinationType === 'originDestination' ? originDestination : destination,
  );

  const handleUpdateForm = (
    e: React.ChangeEvent,
    target: 'originDestination' | 'destination',
    objectKey: 'address' | 'city' | 'number',
  ) => {
    if (target === 'destination') {
      setDestination((prevState: DEF_STATE_TYPE) => ({
        ...prevState,
        [objectKey]: (e.target as HTMLInputElement).value,
      }));
      return;
    }
    setOriginDestination((prevState: DEF_STATE_TYPE) => ({
      ...prevState,
      [objectKey]: (e.target as HTMLInputElement).value,
    }));
  };

  useEffect(() => {
    const getAutoCompleted = async ({ address, city, number }: DEF_STATE_TYPE) => {
      const URL = 'https://autocomplete.search.hereapi.com/v1/autocomplete?q=';
      const convertedUrl = encodeURIComponent(
        `${address.trim()} ${city.trimEnd()} ${number}`,
      );

      if (address.length > 3 || city.length > 3) {
        const response = await fetch(`${URL}${convertedUrl}&apiKey=${API_KEY}`);
        if (!response.ok) {
          console.log(response.status);
          return;
        }
        const json = await response.json();
        if (destinationType === 'originDestination') {
          setSuggestions((prevState) => ({
            ...prevState,
            originDestination: [...json.items],
          }));
          return;
        }

        setSuggestions((prevState) => ({
          ...prevState,
          destination: [...json.items],
        }));
        return;
      }
    };

    if (destinationType === 'originDestination') {
      getAutoCompleted(originDestination);
    } else {
      getAutoCompleted(destination);
    }
  }, [originDestination, destination]);

  return (
    <div className={inputSectionClassName}>
      <div className="w-full">
        <label className="p-2">
          <span className={asterixRequireClassName}>*</span>
          Adres:
        </label>
        <input
          title={addressTitle}
          className={inputClassName}
          value={
            destinationType === 'originDestination'
              ? originDestination.address
              : destination.address
          }
          onChange={(e) => handleUpdateForm(e, destinationType, 'address')}
          placeholder="Wpisz adres"
        />
        {validateErrors?.__address && (
          <span className="ml-2 text-red-400">{validateErrors?.__address}</span>
        )}
      </div>
      <div className="w-full">
        <label className="p-2">
          <span className={asterixRequireClassName}>*</span>
          Miasto:
        </label>
        <input
          title={cityTitle}
          className={inputClassName}
          value={
            destinationType === 'originDestination'
              ? originDestination.city
              : destination.city
          }
          onChange={(e) => handleUpdateForm(e, destinationType, 'city')}
          placeholder="Wpisz miasto"
        />
        {validateErrors?.__city && (
          <span className="ml-2 text-red-400">{validateErrors?.__city}</span>
        )}
      </div>
      <div className="w-full">
        <label className="p-2">
          <span className={asterixRequireClassName}>*</span>
          Numer budynku:
        </label>
        <input
          title={numberTitle}
          className={inputClassName}
          value={
            destinationType === 'originDestination'
              ? originDestination.number
              : destination.number
          }
          onChange={(e) => handleUpdateForm(e, destinationType, 'number')}
          placeholder="Wpisz numer"
        />
        {validateErrors?.__number && (
          <span className="ml-2 text-red-400">{validateErrors?.__number}</span>
        )}
      </div>
      {suggestions[destinationType] && (
        <ul className="p-4 w-full">
          {suggestions?.[destinationType]?.map(
            (
              location: {
                title: string;
                address: { street: string; city: string; houseNumber: string };
              },
              idx,
            ) => (
              <li
                id={destinationType}
                onClick={(e) => {
                  if ((e.target as HTMLLIElement).id === 'originDestination') {
                    setOriginDestination((prevState: DEF_STATE_TYPE) => ({
                      number: prevState.number,
                      address: location.address.street,
                      city: location.address.city,
                    }));
                    return;
                  }
                  setDestination((prevState: DEF_STATE_TYPE) => ({
                    number: prevState.number,
                    address: location.address.street,
                    city: location.address.city,
                  }));
                }}
                className="p-2 my-2 rounded-md text-white bg-blue-300 cursor-pointer"
                key={`${location.title}${idx}`}
              >
                {location.title}
              </li>
            ),
          )}
        </ul>
      )}{' '}
    </div>
  );
};

export default FormSection;
