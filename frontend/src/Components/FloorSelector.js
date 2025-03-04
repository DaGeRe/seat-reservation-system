import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ZWICKAU, LEIPZIG, CHEMNITZ, BAUTZNER_STR_19_A_B, BAUTZNER_STR_19_C, GROUND, FIRST, SECOND } from '../constants';

const FloorSelector = ({
  building,
  setBuilding,
  floor,
  setFloor
}) => {
  const { t } = useTranslation();

  function createFloorsPerBuilding(building_name) {
    if (building_name === BAUTZNER_STR_19_A_B) {
      return [
        <MenuItem key='groundFloor' value={GROUND}>{t('groundFloor').toUpperCase()}</MenuItem>,
        <MenuItem key='firstFloor' value={FIRST}>{t('firstFloor').toUpperCase()}</MenuItem>
      ];
    } else if (building_name === BAUTZNER_STR_19_C) {
      return [
        <MenuItem key='groundFloor' value={GROUND}>{t('groundFloor_19c').toUpperCase()}</MenuItem>,
        <MenuItem key='firstFloor' value={FIRST}>{t('firstFloor_19c').toUpperCase()}</MenuItem>,
        <MenuItem key='thirdFloor' value={SECOND}>{t('thirdFloor_19c').toUpperCase()}</MenuItem>
      ];
    }
    else if (building_name === ZWICKAU) {

    }
    else if (building_name === LEIPZIG) {

    }    
    else if (building_name === CHEMNITZ) {

    }
    return [];
  }

  return (
    <>
      <FormControl id='floorselector_setBuilding' required size='small' fullWidth>
        <InputLabel id='select-label-building'>{t('building')}</InputLabel>
        <Select
          labelId='select-label-building'
          id='select-building'
          value={building}
          label={t('building')}
          onChange={(e) => {
            setBuilding(e.target.value);
            // Make the ground floor as default within an building change.
            setFloor(GROUND);
          }}
        >
          <MenuItem value={BAUTZNER_STR_19_A_B}>{BAUTZNER_STR_19_A_B.toUpperCase()}</MenuItem>
          <MenuItem value={BAUTZNER_STR_19_C}>{BAUTZNER_STR_19_C.toUpperCase()}</MenuItem>
          <MenuItem value={ZWICKAU}>{ZWICKAU.toUpperCase()}</MenuItem>
          <MenuItem value={LEIPZIG}>{LEIPZIG.toUpperCase()}</MenuItem>
          <MenuItem value={LEIPZIG}>{LEIPZIG.toUpperCase()}</MenuItem>
        </Select>
      </FormControl>
      <br /><br />
      <FormControl id='floorselector_setFloor' required size='small' fullWidth>
        <InputLabel id='select-label-floor'>{t('floor')}</InputLabel>
        <Select
          labelId='select-label-floor'
          id='select-floor'
          value={floor}
          label={t('floor')}
          onChange={(e) => setFloor(e.target.value)}
        >
          {createFloorsPerBuilding(building)}
        </Select>
      </FormControl>
    </>
  );
};

export default FloorSelector;
