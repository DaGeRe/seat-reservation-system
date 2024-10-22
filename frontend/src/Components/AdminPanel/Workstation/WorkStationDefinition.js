import { FormControl, Grid2, InputLabel, MenuItem, Select, TextField } from '@mui/material';

export default function WorkStationDefinition({
    t, 
    equipment, 
    setEquipment,
    remark,
    setRemark}) {
        
    return (
        <div>
            <FormControl fullWidth size='small'>
                <InputLabel id='demo-simple-select-label'>{t('equipment')}</InputLabel>
                <Select
                    size='small'
                    labelId="demo-simple-select-label"
                    id='demo-simple-select'
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
            <FormControl required={false} size='small' fullWidth variant='standard'>
                <TextField
                    id='standard-adornment-reason'
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

