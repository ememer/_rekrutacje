/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tailwindTheme = require('tailwindcss/defaultTheme');

const screenPercentages = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90];

const createMinMaxSpacing = (screenUnit) => ({
  ...tailwindTheme.spacing,
  ...screenPercentages.reduce(
    (acc, percentage) => ({
      ...acc,
      [`${percentage}-s`]: `${percentage}${screenUnit}`,
    }),
    {},
  ),
});

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxHeight: createMinMaxSpacing('vh'),
      maxWidth: createMinMaxSpacing('vw'),
      minHeight: createMinMaxSpacing('vh'),
      minWidth: createMinMaxSpacing('vw'),
    },
    plugins: [],
  },
};
