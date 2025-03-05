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
  // An array of all building names with only one floor. We keep the names so we can skip the floor selection.
  const buildings_with_one_floor = [ZWICKAU, LEIPZIG, CHEMNITZ];
  
  /**
   * 
   * @param {*} building_name The name of the building. E.g.: Bautzner Str. 19a/b, Bautzner Str. 19c, Chemnitz, ...
   * @returns Return an array of floors depending on the selected building.
   */
  function createFloorsPerBuilding(building_name) {
    // Floor decision not needed if only one floor is present.
    if (buildings_with_one_floor.includes(building_name)) {
      //setFloor(GROUND);
      return [<MenuItem key='groundFloor' value={GROUND}></MenuItem>];
    }
    else {
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
          }}
        >
          <MenuItem value={BAUTZNER_STR_19_A_B}>{BAUTZNER_STR_19_A_B.toUpperCase()}</MenuItem>
          <MenuItem value={BAUTZNER_STR_19_C}>{BAUTZNER_STR_19_C.toUpperCase()}</MenuItem>
          <MenuItem value={ZWICKAU}>{ZWICKAU.toUpperCase()}</MenuItem>
          <MenuItem value={CHEMNITZ}>{CHEMNITZ.toUpperCase()}</MenuItem>
          <MenuItem value={LEIPZIG}>{LEIPZIG.toUpperCase()}</MenuItem>
        </Select>
      </FormControl>
      <br /><br />
      <FormControl 
        id='floorselector_setFloor' 
        required 
        size='small' 
        fullWidth
        disabled={buildings_with_one_floor.includes(building)} // If the selected building only has one floor we disable the floor selection
      >
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
