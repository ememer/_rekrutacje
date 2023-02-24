import React, { useState } from 'react';

import { useForm } from '../Hook/useForm';

import { AutoCompleteContext } from './AutoCompleteContext';

const DEF_STATE: { address: string; city: string; number: string | number } = {
  address: '',
  city: '',
  number: '',
};

interface Props {
  children: React.ReactNode;
}

const AutoCompleteContextProvider = ({ children }: Props) => {
  const [originDestination, setOriginDestination] = useState(DEF_STATE);
  const [destination, setDestination] = useState(DEF_STATE);

  const { validateErrors } = useForm(destination || originDestination);
  const isValid = Object.keys(validateErrors).length === 0;

  return (
    <AutoCompleteContext.Provider
      value={{
        isValid,
        originDestination,
        setOriginDestination,
        destination,
        setDestination,
      }}
    >
      {children}
    </AutoCompleteContext.Provider>
  );
};

export default AutoCompleteContextProvider;
