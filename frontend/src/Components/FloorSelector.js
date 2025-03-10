import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FIRST_ATTIC, FOURTH_ATTIC, SECOND_ATTIC, ATTIC, BAUTZEN, ZWICKAU, LEIPZIG, CHEMNITZ, BAUTZNER_STR_19_A_B, BAUTZNER_STR_19_C, GROUND, FIRST, SECOND } from '../constants';

const FloorSelector = ({
  building,
  setBuilding,
  floor,
  setFloor
}) => {
  const { t } = useTranslation();
  
  /**
   * 
   * @param {*} building_name The name of the building. E.g.: Bautzner Str. 19a/b, Bautzner Str. 19c, Chemnitz, ...
   * @returns Return an array of floors depending on the selected building.
   */
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
    } else if (building_name === BAUTZEN) {
      return [
        <MenuItem key='first_attic' value={FIRST_ATTIC}>{t('first_attic').toUpperCase()}</MenuItem>
      ];
    } else if (building_name === LEIPZIG) {
      return [
        <MenuItem key='second_attic' value={SECOND_ATTIC}>{t('second_attic').toUpperCase()}</MenuItem>
      ];
    } else if (building_name === ZWICKAU) {
      return [
        <MenuItem key='attic' value={ATTIC}>{t('attic').toUpperCase()}</MenuItem>
      ];
    } else if (building_name === CHEMNITZ) {
      return [
        <MenuItem key='second_attic' value={SECOND_ATTIC}>{t('second_attic').toUpperCase()}</MenuItem>,
        <MenuItem key='fourth_attic' value={FOURTH_ATTIC}>{t('fourth_attic').toUpperCase()}</MenuItem>
      ];
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
            // Set the respective floor as default.
            if (e.target.value === BAUTZNER_STR_19_A_B || e.target.value === BAUTZNER_STR_19_C)
              setFloor(GROUND);
            else if (e.target.value === BAUTZEN)
              setFloor(FIRST_ATTIC);
            else if (e.target.value === ZWICKAU)
              setFloor(ATTIC);
            else if (e.target.value === LEIPZIG || e.target.value === CHEMNITZ)
              setFloor(SECOND_ATTIC);
          }}
        >
          <MenuItem value={BAUTZNER_STR_19_A_B}>{BAUTZNER_STR_19_A_B.toUpperCase()}</MenuItem>
          <MenuItem value={BAUTZNER_STR_19_C}>{BAUTZNER_STR_19_C.toUpperCase()}</MenuItem>
          <MenuItem value={ZWICKAU}>{ZWICKAU.toUpperCase()}</MenuItem>
          <MenuItem value={CHEMNITZ}>{CHEMNITZ.toUpperCase()}</MenuItem>
          <MenuItem value={LEIPZIG}>{LEIPZIG.toUpperCase()}</MenuItem>
          <MenuItem value={BAUTZEN}>{BAUTZEN.toUpperCase()}</MenuItem>
        </Select>
      </FormControl>
      <br /><br />
      <FormControl 
        id='floorselector_setFloor' 
        required 
        size='small' 
        fullWidth
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
