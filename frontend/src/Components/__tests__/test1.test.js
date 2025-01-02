import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App'; // Adjust the path to your App component

test('renders the landing page', () => {
  render(<App />);
  //expect(screen.getByText(/some text/i)).toBeInTheDocument(); // Adjust assertion as needed
});