import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const FloorSelector = ({
  building,
  setBuilding,
  floor,
  setFloor
}) => {
  const { t } = useTranslation();

  function createFloorsPerBuilding(building_name) {
    if (building_name === 'building_bautzner_a_b') {
      return [
        <MenuItem key="groundFloor" value="Ground">{t('groundFloor').toUpperCase()}</MenuItem>,
        <MenuItem key="firstFloor" value="First">{t('firstFloor').toUpperCase()}</MenuItem>
      ];
    } else if (building_name === 'building_bautzner_c') {
      return [
        <MenuItem key="groundFloor" value="Ground">{t('groundFloor').toUpperCase()}</MenuItem>,
        <MenuItem key="firstFloor" value="First">{t('firstFloor').toUpperCase()}</MenuItem>,
        <MenuItem key="thirdFloor" value="Second">{t('thirdFloor').toUpperCase()}</MenuItem>
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
          <MenuItem value="building_bautzner_a_b">{t('building_bautzner_a_b').toUpperCase()}</MenuItem>
          <MenuItem value="building_bautzner_c">{t('building_bautzner_c').toUpperCase()}</MenuItem>
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
