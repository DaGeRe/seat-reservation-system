import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App'; // Adjust the path to your App component
import '@testing-library/jest-dom'; // für bessere Matcher wie `toBeInTheDocument`
//import 'whatwg-fetch';
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
  const email = screen.getByTestId('email');
  fireEvent.change(email, { target: { value: 'test@mail.com' } });
  expect(email.value).toBe('test@mail.com');
  const password = screen.getByTestId('password');
  fireEvent.change(password, { target: { value: 'test' } });
  expect(password.value).toBe('test');
  const loginBtn = screen.getByTestId(/loginBtn/i);
  fireEvent.click(loginBtn);
   // Warte explizit eine Sekunde, bevor du nach dem Element suchst
   /*await waitFor(() => {
    const errorElement = screen.queryByTestId("loginErrorMsg");
    expect(errorElement).not.toBeInTheDocument();
    expect(homeElement).toBeInTheDocument();
  }, { timeout: 1000 }); // 1000ms = 1 Sekunde
  */
  
//const errorElement = screen.getByTestId("loginErrorMsg");
//expect(errorElement).toBeInTheDocument();
});