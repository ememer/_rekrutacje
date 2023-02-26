import React, { useState } from 'react';

import { ApiErrors } from '../Types/ApiResponseContextTypes';

import { ApiResponseContext } from './ApiResponseContext';

interface Props {
  children: React.ReactNode;
}

const ApiResponseContextProvider = ({ children }: Props) => {
  const [errorMessage, setErrorMessage] = useState<object | ApiErrors>({});
  return (
    <ApiResponseContext.Provider value={{ errorMessage, setErrorMessage }}>
      {children}
    </ApiResponseContext.Provider>
  );
};

export default ApiResponseContextProvider;
