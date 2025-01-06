import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App'; // Adjust the path to your App component
import '@testing-library/jest-dom'; // für bessere Matcher wie `toBeInTheDocument`
//import { Experimental_CssVarsProvider } from '@mui/material';

test('login present', () => {
  render(<App />);
  const loginElements = screen.getAllByText(/Login/i);
  expect(loginElements.length).toBeGreaterThan(0);
})

test('login error not present', () => {
  render(<App />);
  const errorElement = screen.queryByTestId("loginErrorMsg");
  expect(errorElement).not.toBeInTheDocument();
})

test('login error  present', () => {
  render(<App />);
  const loginBtn = screen.getByTestId(/loginBtn/i);
  fireEvent.click(loginBtn);
  const errorElement = screen.getByTestId("loginErrorMsg");
  expect(errorElement).toBeInTheDocument();
});

test('login', async  () => {
  render(<App />);
  console.log('process.env.REACT_APP_BACKEND_URL', process.env.REACT_APP_BACKEND_URL);
  const email = screen.getByTestId('email');
  fireEvent.change(email, { target: { value: 'Richard.Lehmann@lit.justiz.sachsen.de' } });
  expect(email.value).toBe('Richard.Lehmann@lit.justiz.sachsen.de');
  const password = screen.getByTestId('password');
  fireEvent.change(password, { target: { value: 'admin' } });
  expect(password.value).toBe('admin');
  const loginBtn = screen.getByTestId(/loginBtn/i);
  fireEvent.click(loginBtn);
   // Warte explizit eine Sekunde, bevor du nach dem Element suchst
   await waitFor(() => {
    const errorElement = screen.queryByTestId("loginErrorMsg");
    expect(errorElement).not.toBeInTheDocument();
    expect(homeElement).toBeInTheDocument();
  }, { timeout: 1000 }); // 1000ms = 1 Sekunde
  
//const errorElement = screen.getByTestId("loginErrorMsg");
//expect(errorElement).toBeInTheDocument();
});