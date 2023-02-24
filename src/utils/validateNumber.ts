export const validateNumber = (number: unknown) => {
  const numberRegEx = /^\d+$/;
  return numberRegEx.test(number as string);
};
