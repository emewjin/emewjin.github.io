module.exports = {
  'src/**/*.{ts,tsx}': () => 'yarn typecheck',
  'src/**/*.{js,jsx,ts,tsx}': ['eslint --fix'],
};
