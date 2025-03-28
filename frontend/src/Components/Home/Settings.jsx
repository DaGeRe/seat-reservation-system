import React, { useMemo, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem , Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useTranslation } from "react-i18next";
import { getRequest } from "../RequestFunctions/RequestFunctions";

/**
 * This component allows the user to set its default building and default floor.
 * After setting the defaults, the specified building and floor is always shown first when selecting an desk.
 * @param isOpen Define if the modal shall be open.
 * @param onClose A function that close this modal. 
 * @returns  A component that allows the user to set the default building and floor.
 */
const Settings = ({ isOpen, onClose }) => {
    const headers = useMemo(() => {
        const storedHeaders = sessionStorage.getItem('headers');
        return storedHeaders ? JSON.parse(storedHeaders) : {};
    }, []);
    const [buildings, setBuildings] = useState([]);
    const [floors, setFloors] = useState([]);
    const [defaultBuilding, setDefaultBuilding] = useState('');
    const [defaultFloor, setDefaultFloor] = useState('');
    const { t } = useTranslation();

    /**
     * Fetch all buildings to select the default building.
     */
    React.useEffect(() => {
        getRequest(
            `${process.env.REACT_APP_BACKEND_URL}/buildings/all`, 
            headers,
            setBuildings,
            () => {
                console.log('Error fetching buildings in Settings.jsx');
            },
        );
    },[headers, setBuildings]);

    /**
     * Fetch all floors for the default building to set as default floor.
     */
    React.useEffect(() => {
      if (!defaultBuilding)
        return;
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/floors/getAllFloorsForBuildingId/${Number(defaultBuilding.building_id)}`, 
        headers,
        setFloors,
        () => {
            console.log('Error fetching floors in Settings.jsx');
        },
      );
    },[headers, defaultBuilding, setFloors]);

    /**
     * Sends the default building and floor to database.
     */
    function saveDefaults() {
      console.log(defaultBuilding.name, defaultFloor.name);
    };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{t('settings')}</DialogTitle>
      <DialogContent>
        <FormControl id='settings_setBuilding' required size='small' fullWidth>
            <InputLabel>{t('building')}</InputLabel>
            <Select
                id='settings_select-building'
                value={defaultBuilding}
                label={t('building')}
                onChange={(e) => {
                    setDefaultFloor('');
                    setDefaultBuilding(e.target.value);
                }}
            >
                {buildings.map(e => {
                    return <MenuItem key={e.building_id} value={e}>{e.name}</MenuItem>;
                })}
            </Select>
        </FormControl>
        <br/><br/>
        <FormControl id='settings_setFloor' required size='small' fullWidth>
            <InputLabel>{t('floor')}</InputLabel>
            <Select
                id='settings_select-floor'
                value={defaultFloor}
                label={t('floor')}
                onChange={(e) => {
                    setDefaultFloor(e.target.value);
                }}
            >
                {floors.map(e => {
                    return <MenuItem key={e.floor_id} value={e}>{e.name}</MenuItem>;
                })}
            </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button id='logoutConfirmationModal_onClose'  onClick={onClose} color='primary'>
          {t('cancel')}
        </Button>
        <Button id='logoutConfirmationModal_onConfirm' onClick={saveDefaults} color='primary' autoFocus>
          {t('submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings;