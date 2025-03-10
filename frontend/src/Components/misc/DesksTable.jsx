import { BAUTZEN, CHEMNITZ, GROUND, ZWICKAU, FIRST, LEIPZIG, BAUTZNER_STR_19_C } from '../../constants';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

const DeskTable = ({name, desks, submit_function}) =>{
    const { t } = useTranslation();
    
    function floorTableCell(building, floor) {
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
            return floorName;
    };
    
    return (
        <TableContainer component={Paper} sx={{
            maxHeight: 400, // Set max height
            overflowY: 'auto', // Enable vertical scroll
        }}>
            <Table stickyHeader id='room_table'>
                <TableHead>
                    <TableRow>
                        <TableCell>{t('deskRemark')}</TableCell>
                        <TableCell>{t('equipment')}</TableCell>
                        <TableCell>{t('roomRemark')}</TableCell>
                        <TableCell>{t('building')}</TableCell>
                        <TableCell>{t('floor')}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        desks.map((desk) => (
                            <TableRow id={name+'_'+desk.remark + desk.id} key={desk.id}>
                                <TableCell>{desk.remark}</TableCell>
                                <TableCell>{desk.equipment  === 'with equipment' ? t('withEquipment') : t('withoutEquipment')}</TableCell>
                                <TableCell>{desk.room.remark}</TableCell>
                                <TableCell>{desk.room.building}</TableCell>
                                <TableCell>{floorTableCell(desk.room.building, desk.room.floor)}</TableCell>
                                <TableCell>
                                    <Button id={`sbmt_btn_${desk.remark}`} variant='contained' onClick={(_)=>{
                                        submit_function(desk);}}>
                                        {t('submit')}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export {DeskTable};