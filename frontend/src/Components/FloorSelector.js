import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BAUTZNER_STR_19_A_B, BAUTZNER_STR_19_C, GROUND, FIRST, SECOND } from '../constants';

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
    return [];
  }

  return (
    <>
      <FormControl required size='small' fullWidth>
        <InputLabel id='select-label-building'>{t('building')}</InputLabel>
        <Select
          labelId='select-label-building'
          id='select-building'
          value={building}
          label={t('building')}
          onChange={(e) => setBuilding(e.target.value)}
        >
          <MenuItem value={BAUTZNER_STR_19_A_B}>{BAUTZNER_STR_19_A_B.toUpperCase()}</MenuItem>
          <MenuItem value={BAUTZNER_STR_19_C}>{BAUTZNER_STR_19_C.toUpperCase()}</MenuItem>
        </Select>
      </FormControl>
      <br /><br />
      <FormControl required size='small' fullWidth>
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
