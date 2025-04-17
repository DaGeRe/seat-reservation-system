import React, { useState, useRef } from 'react';
import {Dialog, TextField, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { putRequest } from '../RequestFunctions/RequestFunctions';

const ChangePassword = ({ isOpen, onClose }) => {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t, i18n } = useTranslation();
  const userId = localStorage.getItem('userId');
  const [prevPassword, setPrevPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');

  function submit() {
    if (newPassword === '' || prevPassword === '' || newPasswordAgain === '') {
      toast.error(i18n.language === 'de' ? 'Alle Felder müssen befüllt sein' : 'All fields must have an value');
      return;
    }
    if (newPassword !== newPasswordAgain) {
      toast.error(t('passwordsDontMatch'));
      return;
    }

    putRequest(
      `${process.env.REACT_APP_BACKEND_URL}/users/password/${userId}`,
      headers.current,
      (data) => {
        if (data) {
          toast.success(t('passwordChangedSuccessfully'));
          onClose();
        }
        else {
          toast.error(t('passwordChangFailed'));
        }
      },
      () => {
        toast.error(t('passwordChangFailed'));
      },
      JSON.stringify({
        oldPassword: prevPassword,
        newPassword: newPassword
      })
    );
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{t('password')}</DialogTitle>
      <DialogContent>
        <div id='changePassword_prevPassword'>
          <TextField label={t('previousPassword')} type='password' onChange={e=>setPrevPassword(e.target.value)} value={prevPassword} required/>
        </div>
        <br/><br/>
        <div id='changePassword_newPassword'>
          <TextField label={t('newPassword')} type='password' onChange={e=>setNewPassword(e.target.value)} value={newPassword} required/>
        </div>
        <br/><br/>
        <div id='changePassword_newPasswordAgain'>
        <TextField label={t('newPassword')} type='password' onChange={e=>setNewPasswordAgain(e.target.value)} value={newPasswordAgain} required/>
        </div>
      </DialogContent>
      <DialogActions>
        <Button id='changePassword_close' onClick={onClose} color='primary'>
          {t('cancel')}
        </Button>
        <Button id='changePassword_submit' color='primary' onClick={submit} autoFocus>
          {t('submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePassword;
