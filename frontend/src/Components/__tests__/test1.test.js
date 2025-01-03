import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App'; // Adjust the path to your App component
import '@testing-library/jest-dom'; // für bessere Matcher wie `toBeInTheDocument`
import { Experimental_CssVarsProvider } from '@mui/material';

test('renders the landing page', () => {
  render(<App />);
  // Sucht alle Elemente mit dem Text "Login"
  const loginElements = screen.getAllByText(/Login/i);
  
  // Überprüft, ob mindestens eines vorhanden ist
  expect(loginElements.length).toBeGreaterThan(0);
});