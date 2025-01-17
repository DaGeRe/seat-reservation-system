import DatePicker from 'react-datepicker';
import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './DatepickerStyles.css'; // Custom CSS file
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { FormControl, Box, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
const de = require('date-fns/locale/de');
const FreeDesks = ({ isOpen, onClose }) => {
    const [date, setDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const { t, i18n } = useTranslation();
    const {desks, setDesks} = useState([])



    if (!isOpen) return null;

/*     const handleSubmit = async (e) => {
      console.log("!!!");
    }; */
    const handleSubmit = async (e) => {
      console.log(date);
      console.log(endDate);
    };

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
          {/*<div>
            {desks ? len(desks) : 123}
          </div>*/}
        </div>
      </div>
    );

   /*  return (
        <div
          style={{
          position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            //justifyContent: "center",
            alignItems: "center",
            zIndex: 9999 // Set a high z-index value
          }}
            //className='overlay'
            onClick={onClose}
          >
              <div
                //className='inlay'
                style={{
                  padding: "10px",
                  background: "#FFF",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  minHeight: "200px",
                  margin: "1rem",
                  position: "relative",
                  minWidth: "300px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}
                onClick={(e) => e.stopPropagation()} // Prevent click from closing the modal
              >
                <div>
                <Box display="flex" alignItems="center">
                <FormControl required={true} size="small" fullWidth variant="standard">
                  <DatePicker
                    selected={date}
                    onChange={setDate}
                    showTimeSelect
                    dateFormat="dd.MM.yyyy hh:mm:ss"
                    timeIntervals={15} // Zeitintervall in Minuten
                    minDate={new Date()} // Verhindert vergangene Termine
                    locale={de} // Deutsche Locale
                    timeCaption="Zeit" // Zeitbeschreibung
                    customInput={
            
                      <TextField
                          id="standard-adornment-reason-surname"
                          label={'Start'}
                          size="small"
                          value={date}
                          type={"text"}
                      />
           
                    }
                  />
                  </FormControl>
</Box>
                </div>
                <div>
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
                </div>
                <button type="submit" onClick={handleSubmit} style={{
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
            {
              <div>
                {desks ? len(desks) : 123}
              </div>
            }
          </div>
  ); */
};

export default FreeDesks;