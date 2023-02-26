export type ApiErrors = {
  __errRequest: string;
};

export interface ApiResponseContextType {
  errorMessage: any | ApiErrors;
  setErrorMessage: React.Dispatch<React.SetStateAction<object | ApiErrors>>;
}
