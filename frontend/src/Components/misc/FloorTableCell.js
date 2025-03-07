import { BAUTZEN, CHEMNITZ, GROUND, ZWICKAU, FIRST, LEIPZIG, BAUTZNER_STR_19_C } from '../../constants';
import { useTranslation } from 'react-i18next';
import {TableCell} from '@mui/material';
/**
 * Create and return name string for the floor in depending of the selected building and floor. 
 * @param {} building The name of the building (Leipzig, Bautzner Str. 19c, ...)
 * @param {*} floor The name of the floor (Ground, First_Attic, ...)
 */
const FloorTableCell = ({building, floor}) => {
    const { t } = useTranslation();
    let floorName = '';
    if (building === BAUTZNER_STR_19_C) {
        if (floor === GROUND) {
            floorName = t('groundFloor_19c');
        }
        else if (floor === FIRST) {
            floorName = t('firstFloor_19c')
        }
        else {
            floorName = t('thirdFloor_19c');
        }
    }
    else if (building === ZWICKAU || building === CHEMNITZ) {
        floorName = t('attic');
    }
    else if (building === BAUTZEN) {

        floorName = t('first_attic');
    }
    else if (building === LEIPZIG) {
        floorName = t('second_attic');
    }
    else {
        if (floor === GROUND) {
            floorName = t('groundFloor');
        }
        else if (floor === FIRST) {
            floorName = t('firstFloor');
        }
        else {
            floorName = t('thirdFloor');
        }
    }
    //console.log(building, floor, floorName);
    return (<TableCell>{floorName}</TableCell>);
}

export {FloorTableCell};