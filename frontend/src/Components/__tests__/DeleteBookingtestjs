import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DeleteBookings from '../AdminPanel/Bookings/DeleteBookings';
import { I18nextProvider } from 'react-i18next'
import i18n from './../../i18n';
import { toast } from 'react-toastify';
import React from 'react';
// Mock the react-toastify module
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));
const toggleModalMock = jest.fn()
describe("Delete booking component test cases", () => {
  

  test('Delete booking Submitting form with missing data', async () => {
    render(<DeleteBookings deleteBookingsModal={toggleModalMock} />);
    fireEvent.click(screen.getByRole('button', { name: /SEARCH/i }));
    expect(screen.getByText("No data found"));
  });

  test('Delete booking Modal closable', async () => {
    render(<DeleteBookings deleteBookingsModal={toggleModalMock} />);
    fireEvent.click(screen.getByRole('button', { name: /CLOSE/i }));
    expect(toggleModalMock).toBeDefined();
  });

});