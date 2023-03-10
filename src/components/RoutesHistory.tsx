import React, { useEffect, useState } from 'react';

import { DEF_STATE_TYPE } from '../Types/AutoCompleteContextTypes';

const RoutesHistory = () => {
  const [lastRoutes, setLastRoutes] = useState<[] | [[DEF_STATE_TYPE, DEF_STATE_TYPE]]>(
    [],
  );

  // Last routes are stored in sessionStorage, to remove those at page refresh
  const deleteStorage = (e: Event) => {
    e.preventDefault(), sessionStorage.removeItem('routes');
  };

  useEffect(() => {
    // React on Page refresh
    window.addEventListener('beforeunload', deleteStorage);
    const storage = sessionStorage.getItem('routes');
    if (storage) {
      setLastRoutes(JSON.parse(storage));
    }

    return () => window.addEventListener('beforeunload', deleteStorage);
  }, []);

  return (
    <ul className="mx-auto my-4 w-3/4  px-4">
      <h2 className="text-2xl text-center">Ostatnie wyszukiwania</h2>
      {lastRoutes &&
        lastRoutes.map((lastRoute, idx) => (
          <li
            className="flex justify-between items-center bg-blue-50 rounded-md shadow-md my-2 p-2"
            key={lastRoute[0].address + idx}
          >
            <ul className="my-4 p-2">
              <span className="my-2 font-bold">Punkt Startowy</span>
              <li>{lastRoute[0].address}</li>
              <li>{lastRoute[0].city}</li>
              <li>{lastRoute[0].number}</li>
            </ul>

            <ul className="my-4 p-2">
              <span className="my-2 font-bold">Punkt końcowy</span>
              <li>{lastRoute[1].address}</li>
              <li>{lastRoute[1].city}</li>
              <li>{lastRoute[1].number}</li>
            </ul>
          </li>
        ))}
    </ul>
  );
};

export default RoutesHistory;
