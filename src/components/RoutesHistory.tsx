import React, { useEffect, useState } from 'react';

import { DEF_STATE_TYPE } from '../Types/AutoCompleteContextTypes';

const RoutesHistory = () => {
  const [lastRoutes, setLastRoutes] = useState<[] | [[DEF_STATE_TYPE, DEF_STATE_TYPE]]>(
    [],
  );

  useEffect(() => {
    const isLocalStorage = localStorage.getItem('routes');
    if (isLocalStorage) {
      setLastRoutes(JSON.parse(isLocalStorage));
    }
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
