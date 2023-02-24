import React, { useContext } from 'react';

import { Link } from 'react-router-dom';

import FormSection from './components/FormSection';
import { AutoCompleteContext } from './Context/AutoCompleteContext';
import { AutoCompleteContextTypes } from './Types/AutoCompleteContextTypes';

import './App.css';

const btnEnabled = 'w-1/4 block ml-auto p-4 bg-green-500 text-gray-800';
const btnDisabled = 'w-1/4 block ml-auto p-4 bg-gray-500 text-white';

function App() {
  const { isValid } = useContext(AutoCompleteContext) as AutoCompleteContextTypes;

  return (
    <div className="container mx-auto">
      <form className="w-3/4 mx-auto">
        <FormSection
          addressTitle="Adres trasy początkowej"
          cityTitle="Miasto trasy początkowej"
          numberTitle="Numer budynku trasy początkowej"
          destinationType="originDestination"
        />
        <FormSection
          addressTitle="Adres trasy końcowej"
          cityTitle="Miasto trasy końcowej"
          numberTitle="Numer budynku trasy końcowej"
          destinationType="destination"
        />
        <div className="p-2 w-full">
          <button disabled={!isValid} className={isValid ? btnEnabled : btnDisabled}>
            <Link to={isValid ? '/calculated-road' : '#'}>Oblicz trase</Link>
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
