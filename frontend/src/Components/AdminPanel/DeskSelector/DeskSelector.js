import {TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React from 'react';

export default function DeskSelector(
    {
        selectedRoom,
        allDesks,
        selectedDesk,
        setSelectedDesk,
        roomToOption,
        deskToOption,
        isOptionEqualToValue_Desk,
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
                    id="tags-filled"
                    fullWidth
                    options={allDesks.map(deskToOption)}
                    isOptionEqualToValue={isOptionEqualToValue_Desk}
                    freeSolo={false} // Eingabe ist deaktiviert
                    value={selectedDesk}
                    onChange={(_, selectedDeskStr) => {
                        setSelectedDesk(selectedDeskStr);
                    }}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        disabled
                        label={t("selectDesk")}
                        placeholder={t("selectDesk")}
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