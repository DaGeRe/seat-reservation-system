import React, { useMemo, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem , Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useTranslation } from "react-i18next";
import { getRequest } from "../RequestFunctions/RequestFunctions";
import { toast } from 'react-toastify';

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
     * Fetch all default building and floor for current user.
     */
    React.useEffect(() => {
      getRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/getDefaultFloorForUserId/${localStorage.getItem('userId')}`, 
          headers,
          ((floor)=>{            
            setDefaultBuilding(floor.building)
            setDefaultFloor(floor);
          }),
          () => {
              console.log('Error fetching default building and floor in Settings.jsx');
          },
      );
    },[headers, isOpen, setDefaultFloor]);


    /**
     * Fetch all buildings to select the default building.
     */
    React.useEffect(() => {
      if (defaultFloor === '' || defaultBuilding === '')
        getRequest(
            `${process.env.REACT_APP_BACKEND_URL}/buildings/all`, 
            headers,
            setBuildings,
            () => {
                console.log('Error fetching buildings in Settings.jsx');
            },
        );
    },[headers, setBuildings, defaultBuilding, defaultFloor]);

    /**
     * Fetch all floors for the default building to set as default floor.
     */
    React.useEffect(() => {
      if (!defaultBuilding)
        return;
      if (defaultFloor === '' || defaultBuilding === '')
        console.log(2);
        getRequest(
          `${process.env.REACT_APP_BACKEND_URL}/floors/getAllFloorsForBuildingId/${Number(defaultBuilding.building_id)}`, 
          headers,
          setFloors,
          () => {
              console.log('Error fetching floors in Settings.jsx');
          },
        );
    },[headers, defaultBuilding, defaultFloor, setFloors]);

    /**
     * Sends the default building and floor to database.
     */
    function saveDefaults() {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/setDefaulFloorForUserId/${localStorage.getItem('userId')}/${defaultFloor.floor_id}`, 
        headers,
        (ret => {
          if (ret === true) {
            toast.success(t('settingsUpdated'));
            onClose()
          } else {
            toast.error(t('settingsUpdatedFail'));
          }
        }),
        () => {
          console.log('Failing to put defaults in Settings.jsx.');
        }
      );
    };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{t('settings')}</DialogTitle>
      <DialogContent>
        <br/>
        <FormControl id='settings_setBuilding' required size='small' fullWidth>
            <InputLabel>{t('building')}</InputLabel>
            <Select
                id='settings_select-building'
                value={defaultBuilding?.building_id || ''}
                label={t('building')}
                onChange={(e) => {
                    setDefaultFloor('');
                    setDefaultBuilding(buildings.find(b => b.building_id === e.target.value) || '');
                }}
            >
                {buildings.map(e => {
                    return <MenuItem id={`settings_building_${e.building_id}`} key={e.building_id} value={e.building_id}>{e.name}</MenuItem>;
                })}
            </Select>
        </FormControl>
        <br/><br/>
        <FormControl id='settings_setFloor' required size='small' fullWidth>
            <InputLabel>{t('floor')}</InputLabel>
            <Select
                id='settings_select-floor'
                value={defaultFloor?.floor_id || ''}
                label={t('floor')}
                onChange={(e) => {
                  setDefaultFloor(floors.find(f => f.floor_id === e.target.value) || '');
                }}
            >
                {floors.map(e => {
                    return <MenuItem id={`settings_floor_${e.floor_id}`} key={e.floor_id} value={e.floor_id}>{e.name}</MenuItem>;
                })}
            </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button id='logoutConfirmationModal_onClose' onClick={onClose} color='primary'>
          {t('cancel')}
        </Button>
        <Button id='logoutConfirmationModal_onConfirm' disabled={defaultBuilding === '' || defaultFloor === ''} onClick={saveDefaults} color='primary' autoFocus>
          {t('submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings;