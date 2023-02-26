export const useApiResponse = (response: Response) => {
  if (response.status === 404) {
    return { __errRequest: 'Nie znaleziono strony' };
  }
  if (response.status === 429) {
    return { __errRequest: 'Za dużo zapytań, spróbuj później' };
  }
  if (response.status === 500) {
    return { __errRequest: 'Błąd połączenia z serwerem' };
  }
  if (response.status === 502) {
    return { __errRequest: 'Błąd wykonania rządania' };
  }
  if (`${response.status}`.startsWith('4')) {
    return { __errRequest: 'Tymczasowy błąd połączenia' };
  }
  if (`${response.status}`.startsWith('5')) {
    return { __errRequest: 'Brak kompunikacji z serwer, spróbuj później' };
  }
  if (response.status) {
    return {
      __errRequest: `Wystąpił błąd spróbuj później, Kod błędu: ${response.status}`,
    };
  }

  return {};
};
