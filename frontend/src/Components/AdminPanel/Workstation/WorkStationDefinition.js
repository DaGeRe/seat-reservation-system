import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

export default function WorkStationDefinition({
    t, 
    equipment, 
    setEquipment,
    remark,
    setRemark}) {

    return (
        <div>
            <FormControl id='workstationDefinition_setEquipment' fullWidth size='small'>
                <InputLabel id='demo-simple-select-label'>{t('equipment')}</InputLabel>
                <Select
                    size='small'
                    labelId="demo-simple-select-label"
                    id='select_equipment'
                    value={equipment}
                    placeholder='Equipments'
                    label='Equipments'
                    onChange={(e) => setEquipment(e.target.value)}
                >
                    <MenuItem value={'with equipment'}>{t('withEquipment').toUpperCase()}</MenuItem>
                    <MenuItem value={'without equipment'}>{t('withoutEquipment').toUpperCase()}</MenuItem>
                </Select>
            </FormControl>
            <br></br><br></br>
            <FormControl id='workStationDefinition_setRemark' required={false} size='small' fullWidth variant='standard'>
                <TextField
                    id='textfield_desk_remark'
                    data-testid='textfield_desk_remark'
                    label={t('deskRemark')}
                    size='small'
                    type={'string'}
                    value={remark}
                    onChange={(e)=>setRemark(e.target.value)}
                />
            </FormControl>
        </div>
    );
}

