module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    // Disable some rules that might be too strict for this project
    'no-unused-vars': 'warn',
    'react/jsx-key': 'warn',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    // Add any other custom rules here
  },
  ignorePatterns: ['node_modules/', 'build/', 'dist/'],
  settings: {
    react: {
      version: 'detect',
    },
  },
}; 