import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from "react-i18next";

const FloorSelector = ({
  floor,
  setFloor
}) => {
  const { t } = useTranslation();

  return (
    <FormControl required={true} size="small" fullWidth>
      <InputLabel id="select-label-floor">{t('floor')}</InputLabel>
      <Select
        labelId="select-label-floor"
        id="select-floor"
        value={floor}
        label={t("floor")}
        onChange={(e) => {
          const floorStr = e.target.value;
          setFloor(floorStr);
        }}
      >
        <MenuItem value={'First'}>{t('firstFloor').toUpperCase()}</MenuItem>
        <MenuItem value={'Ground'}>{t('groundFloor').toUpperCase()}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FloorSelector;