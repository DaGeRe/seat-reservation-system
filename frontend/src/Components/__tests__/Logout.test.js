import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LogoutConfirmationModal from '../Home/LogoutConfirmationModal';

describe('LogoutConfirmationModal', () => {
  it('renders correctly with provided props', () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    const { getByText } = render(
      <LogoutConfirmationModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />
    );

    expect(getByText('logout')).toBeInTheDocument();
    expect(getByText('logoutConfirmation')).toBeInTheDocument();
    expect(getByText('cancel')).toBeInTheDocument();
    expect(getByText('toLogout')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    const { getByText } = render(
      <LogoutConfirmationModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />
    );

    fireEvent.click(getByText('cancel'));

    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls onConfirm when toLogout button is clicked', () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    const { getByText } = render(
      <LogoutConfirmationModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />
    );

    fireEvent.click(getByText('toLogout'));

    expect(onConfirm).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    const { queryByText } = render(
      <LogoutConfirmationModal isOpen={false} onClose={onClose} onConfirm={onConfirm} />
    );

    expect(queryByText('logout')).not.toBeInTheDocument();
    expect(queryByText('logoutConfirmation')).not.toBeInTheDocument();
    expect(queryByText('cancel')).not.toBeInTheDocument();
    expect(queryByText('toLogout')).not.toBeInTheDocument();
  });
});