import {TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React from 'react';

export default function DeskSelector(
    {
        selectedRoom,
        allDesks,
        selectedDesk,
        roomToOption,
        setSelectedDeskId,
        setEquipment,
        setRemark,
        t
    }
) {
    return (
        selectedRoom && (
            <div>
                <h2>{roomToOption(selectedRoom)}</h2>
                {allDesks && allDesks.length > 0 ? (
                <div>
                    <Autocomplete
                    id='tags-filled'
                    fullWidth
                    options={
                        allDesks.map(
                            (desk) => {
                                const equipment = desk.equipment === 'with equipment' ? t('withEquipment') : t('withoutEquipment');
                                return desk.deskNumberInRoom + '-' + equipment  + '-' + desk.remark;
                            }
                        )
                    }
                    freeSolo={false} // Eingabe ist deaktiviert
                    value={selectedDesk}
                    onChange={(_, option) => {
                        const array = option.split('-');
                        const currDeskNumberInRoom = array[0];
                        const currEquipment_translated = array[1];
                        const currEquipment = currEquipment_translated === 'Mit Austattung' ? 'with equipment' : 'without equipment';
                        const currRemark = array[2];
                        const deskId = allDesks.find(desk => desk.deskNumberInRoom.toString() === currDeskNumberInRoom).id;
                        
                        setSelectedDeskId(deskId);
                        if (setRemark)
                            setRemark(currRemark);
                        if (setEquipment)
                            setEquipment(currEquipment);
                    }}
                    renderInput={(params) => (
                        <TextField
                        class='textfield_desk_in_room'
                        {...params}
                        variant='outlined'
                        size='small'
                        disabled
                        label={t('selectDesk')}
                        placeholder={t('selectDesk')}
                        />
                    )}
                    />
                </div>
                ) : (
                <div>{t('noWorkstationForThisRoom')}</div>
                )}
            </div>
        )
    );
};