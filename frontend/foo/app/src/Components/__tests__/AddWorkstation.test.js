import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AddWorkstation from '../AdminPanel/Workstation/AddWorkstation';
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

describe("AddWorkstation component test cases", () => {
  

  test('Submitting form with missing data', async () => {
    render(<AddWorkstation addWorkstationModal={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /SUBMIT/i }));
    expect(toast.error).toHaveBeenCalledWith('Please Select Room');
  });
});