import { DEF_STATE_TYPE } from '../Types/AutoCompleteContextTypes';
import { validateNumber } from '../utils/validateNumber';

const validateForm = ({ address, city, number }: DEF_STATE_TYPE) => {
  if (!address || !city || !number) {
    return {
      __err: '',
    };
  }
  if (address && (address as string).length < 3) {
    return {
      __address: 'Pole powinno mieć minimum 3 znaki',
    };
  }
  if (city && (city as string).length < 3) {
    return {
      __city: 'Pole powinno mieć minimum 3 znaki',
    };
  }
  if (!validateNumber(number as number)) {
    return {
      __number: 'Podaj prawidłowy numer',
    };
  }

  return {};
};

export const useForm = (validateObject: DEF_STATE_TYPE) => {
  const validateErrors = validateForm(validateObject);
  return { validateErrors };
};
