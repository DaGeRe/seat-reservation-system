import { useState } from 'react';
import { IconButton, DialogContent, DialogActions, Button } from '@mui/material';
import LiveHelpIcon  from '@mui/icons-material/HelpOutline';
import './InfoModal.css';
import { useTranslation } from 'react-i18next';

const InfoModal = ({text}) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    // Funktion zum Öffnen des Modals
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    // Funktion zum Schließen des Modals
    const handleClose = () => {
      setIsModalOpen(false);
    };
  
    return (
      <>
      <IconButton
        aria-label='help'
        onClick={openModal}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#fff',
          color: '#008444',
          boxShadow: 3,
          padding: 0, // etwa 12px
          minWidth: 'auto',
          minHeight: 'auto',
          width: 'auto',
          height: 'auto',
          zIndex: 1500,
          '&:hover': {
            backgroundColor: '#f1f1f1',
          },
        }}
      >
        <LiveHelpIcon />
      </IconButton>

        {isModalOpen && (
          <div className='modal-overlay'>
            <DialogContent className="modal-content">
              <p style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: text }} />
              <DialogActions>
                <Button onClick={handleClose}>
                  {t('close').toUpperCase()}
                </Button>
              </DialogActions>
            </DialogContent>
          </div>
        )}
      </>
    );
  };
  
  export default InfoModal;