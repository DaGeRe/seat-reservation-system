import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import './InfoModal.css'; // Optional: Styles
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useTranslation } from "react-i18next";

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
      <div>
        {/* <div>Information!!!</div> */}
        {/* Trigger Button mit dem Fragezeichen */}

            <button onClick={openModal} className="help-button">
                <QuestionMarkIcon
                />
            </button>

        
        {/* Modal wird nur gerendert, wenn isModalOpen true ist */}
        {isModalOpen && (
          <div className="modal-overlay">
            <DialogContent className="modal-content">
               {/* <p>{text}</p> */}
             <p dangerouslySetInnerHTML={{ __html: text }} />
                <DialogActions>
                    <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
                </DialogActions>
            </DialogContent>
          </div>
        )}
      </div>
    );
  };
  
  export default InfoModal;