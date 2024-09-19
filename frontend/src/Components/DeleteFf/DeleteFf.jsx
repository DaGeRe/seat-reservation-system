import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import React, {useEffect } from 'react';

export default function DeleteFf({open, onClose, onDelete, text}) {
    const { t } = useTranslation();

    return (            
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle id="alert-dialog-title">
                {t('deleteMoreElements')}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {text}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('no')}</Button>
                <Button 
                    onClick={() => { 
                            onDelete();
                            onClose();
                        }
                    }    
                >
                    {t('yes')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};