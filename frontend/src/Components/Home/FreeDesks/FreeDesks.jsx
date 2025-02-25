import DatePicker from 'react-datepicker';
import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './DatepickerStyles.css'; // Custom CSS file
import { useTranslation } from "react-i18next";
import { de } from "date-fns/locale";
import DialogContent from '@mui/material/DialogContent';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const FreeDesks = ({ isOpen, onClose }) => {
    
    if (!isOpen) return null;

   /* const getBookings = useCallback(
      async () => {

      },
      [headers, setBookings, filter, text]
    );
    React.useEffect(() => {
      getBookings();
    }, [getBookings]); */

    return (
      <React.Fragment>
        <DialogContent>
          <div className='modal-overlay' onClick={onClose}>
              <div className='modal-content' onClick={(e) => e.stopPropagation()}>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                showTimeSelect
                dateFormat='dd.MM.yyyy HH:mm:ss'
                timeIntervals={15}
                minDate={date || new Date()} // Ensures end date is not before start date
                locale={de}
                timeCaption=""
                placeholderText=""
                customInput={<input className='datepicker-input' ></input>}
              />
              </div>
          </div>
            <TableContainer component={Paper} sx={{
              maxHeight: 1000, // Set max height
              overflowY: 'auto', // Enable vertical scroll
            }}>
            <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('room')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                </TableBody>
            </Table>    
          </TableContainer>
        </DialogContent>
      </React.Fragment>
    );
};

/*
return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <DatePicker
                    selected={endDate}
                    onChange={setEndDate}
                    showTimeSelect
                    dateFormat="dd.MM.yyyy HH:mm:ss"
                    timeIntervals={15}
                    minDate={date || new Date()} // Ensures end date is not before start date
                    locale={de}
                    timeCaption="Zeit"
                    placeholderText="Enddatum auswählen"
                    customInput={<input className="datepicker-input" ></input>}
                  />
        <button type="submit" onClick={onClose} style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#008444",
            color: "#FFF",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s"
          }}>{t("submit")}</button>
        </div>
      </div>
    );*/

export default FreeDesks;