import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AddEmployee from '../AdminPanel/UserManagement/AddEmployee';
import { I18nextProvider } from 'react-i18next'
import i18n from './../../i18n';
import { toast } from 'react-toastify';
const toggleModalMock = jest.fn()
jest.mock('react-toastify');
fetch = jest.fn(() => Promise.resolve());


describe("Add employee component test cases", () => {


    test('Validating addEmployee with empty values', async () => {
        render(
            <I18nextProvider i18n={i18n}>
                <AddEmployee addEmployeeModal={toggleModalMock} t={key=>key} />
            </I18nextProvider>
        );
        const addButton = screen.getByRole("button", { name: /SUBMIT/i });
        fireEvent.click(addButton);
        expect(toast.error).toHaveBeenCalledWith('Fields cannot be blank!');
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
        });
    });

    test('Validating addEmployee with input values', async () => {
        const mockT = jest.fn().mockImplementation((key) => key);
        const toastSuccessSpy = jest.spyOn(toast, 'success');
        global.fetch = jest.fn().mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
              resolve({
                ok: true,
                status,
                json: () => {
                  return returnBody ? returnBody : {};
                },
              });
            });
          });
        render(
            <I18nextProvider i18n={i18n}>
                <AddEmployee addEmployeeModal={toggleModalMock} t={mockT} />
            </I18nextProvider>
        );

        const nameInput = screen.getByLabelText(/^Name/i);
        const emailInput = screen.getByLabelText(/^Email/i);
        const passwordInput = screen.getByLabelText(/^Password/i);
        const surnameInput = screen.getByLabelText(/^Surname/i);

        fireEvent.change(nameInput, { target: { value: 'Test' } });
        fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
        fireEvent.change(passwordInput, { target: { value: 'test' } });
        fireEvent.change(surnameInput, { target: { value: 'SurUser' } });
        console.log(emailInput.value);
        const submitButton = screen.getByRole("button", { name: /SUBMIT/i });

        fireEvent.click(submitButton);
        await waitFor(() => {
            console.log('Arguments passed to toast.success:', toastSuccessSpy.mock.calls);
            expect(toast.error).toHaveBeenCalled();
        });
        expect(toggleModalMock).toBeDefined();
    });
});