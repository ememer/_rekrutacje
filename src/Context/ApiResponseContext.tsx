import { createContext } from 'react';

import { ApiResponseContextType } from '../Types/ApiResponseContextTypes';

export const ApiResponseContext = createContext<ApiResponseContextType | null>(null);
