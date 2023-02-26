import React, { useContext } from 'react';

import { Outlet } from 'react-router-dom';

import { ApiResponseContext } from '../Context/ApiResponseContext';
import { ApiResponseContextType } from '../Types/ApiResponseContextTypes';

const Layout = () => {
  const { errorMessage } = useContext(ApiResponseContext) as ApiResponseContextType;

  return (
    <div className="container mx-auto">
      {errorMessage?.__errRequest && (
        <div className="fixed w-full top-0 left-0 min-h-20-s bg-blue-200 flex items-center justify-center">
          {errorMessage?.__errRequest}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Layout;
