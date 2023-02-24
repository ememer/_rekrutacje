export type DEF_STATE_TYPE = {
  address: string;
  number: string | number;
  city: string;
};

export interface AutoCompleteContextTypes {
  isValid: boolean;
  originDestination: DEF_STATE_TYPE;
  setOriginDestination: Dispatch<SetStateAction<DEF_STATE_TYPE>>;
  destination: DEF_STATE_TYPE;
  setDestination: Dispatch<SetStateAction<DEF_STATE_TYPE>>;
}
