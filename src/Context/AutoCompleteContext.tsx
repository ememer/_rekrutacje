import { createContext } from 'react';

import { AutoCompleteContextTypes } from '../Types/AutoCompleteContextTypes';

export const AutoCompleteContext = createContext<AutoCompleteContextTypes | null>(null);
