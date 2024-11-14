import React, { useState, memo } from 'react';
import {Grid2, Box} from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { FormControl, TextField, InputLabel, MenuItem, Select} from '@mui/material';
import { useTranslation } from "react-i18next";
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import DatePicker, { registerLocale } from 'react-datepicker';
import { de } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import styled from '@emotion/styled';
import { BootstrapDialog, BootstrapDialogTitle } from '../Bootstrap';
// Deutsche Lokalisierung registrieren
registerLocale('de', de);
/**
 * UI element to create series of bookings.
 * @returns The ui element.
 */
const Series =  memo(({ isOpen, setIsOpen }) => {
    //const [isOpen, setIsOpen] = useState(true);
    const [startDatum, setStartDatum] = useState('');
    const [endDatum, setEndDatum] = useState('');
    const [wochentag, setWochentag] = useState('Montag');
    const [startUhrzeit, setStartUhrzeit] = useState('18:00');
    const [endUhrzeit, setEndUhrzeit] = useState('20:00');
    const [frequenz, setFrequenz] = useState('wöchentlich');
    const [ausnahmen, setAusnahmen] = useState([]);
    const { t } = useTranslation();

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleAusnahmeHinzufügen = () => {
        setAusnahmen([...ausnahmen, '']);
      };
    
      const handleAusnahmeÄndern = (index, value) => {
        const neueAusnahmen = [...ausnahmen];
        neueAusnahmen[index] = value;
        setAusnahmen(neueAusnahmen);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const daten = {
          startDatum,
          endDatum,
          wochentag,
          startUhrzeit,
          endUhrzeit,
          frequenz,
          ausnahmen: ausnahmen.filter(a => a) // Leere Einträge entfernen
        };
        console.log('Serientermin Daten:', daten);
        alert('Serientermin wurde erfolgreich erstellt!');
      };

    return (
        <BootstrapDialog aria-labelledby="customized-dialog-title" open={isOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
            SerienTermin
        </BootstrapDialogTitle>
        <React.Fragment>
                <DialogContent>
                <Box sx={{ flexGrow: 1, padding: '10px' }}>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Startdatum</InputLabel>
                       {/*  <input
                        type='date'
                        value={startDatum}
                        onChange={(e) => setStartDatum(e.target.value)}
                        /> */}
                        <DatePicker
                            selected={startDatum}
                            onChange={setStartDatum}
                            locale="de"
                            dateFormat="dd.MM.yyyy"
                            placeholderText="Datum auswählen"
                            showWeekNumbers
                            todayButton="Heute"
                            isClearable
                        />
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Enddatum</InputLabel>
                        <DatePicker
                            selected={endDatum}
                            onChange={setEndDatum}
                            locale="de"
                            dateFormat="dd.MM.yyyy"
                            placeholderText="Datum auswählen"
                            showWeekNumbers
                            todayButton="Heute"
                            isClearable
                        />
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Wochentag</InputLabel>
                        <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            value={wochentag}
                            label='Wochentag'
                            onChange={(e) => setWochentag(e.target.value)}
                        >
                            <MenuItem value='Montag'>Montag</MenuItem>
                            <MenuItem value='Dienstag'>Dienstag</MenuItem>
                            <MenuItem value='Mittwoch'>Mittwoch</MenuItem>
                            <MenuItem value='Donnerstag'>Donnerstag</MenuItem>
                            <MenuItem value='Freitag'>Freitag</MenuItem>
                        </Select>
                    </FormControl> 
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Startzeit</InputLabel>
                        <input
                        type='time'
                        value={startUhrzeit}
                        onChange={(e) => setStartUhrzeit(e.target.value)}
                        />
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Endzeit</InputLabel>
                        <input
                            type='time'
                            value={endUhrzeit}
                            onChange={(e) => setEndUhrzeit(e.target.value)}
                        />
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Wiederholungsfrequenz</InputLabel>
                        <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            value={frequenz} 
                            label='Wochentag'
                            onChange={(e) => setFrequenz(e.target.value)}
                        >
                            <MenuItem value="täglich">Täglich</MenuItem>
                            <MenuItem value="wöchentlich">Wöchentlich</MenuItem>
                            <MenuItem value="monatlich">Monatlich</MenuItem>
                        </Select>
                    </FormControl>
                    <br></br> <br></br>
                    <DialogActions>
                        <Button onClick={()=>handleSubmit()}>&nbsp;{t("submit").toUpperCase()}</Button>
                        <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
                    </DialogActions>
            </Box>
            </DialogContent>
        </React.Fragment>
        </BootstrapDialog>
    );
});

export default Series;