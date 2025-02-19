
import { FormControl, TextField, InputLabel, MenuItem, Select} from '@mui/material';

export default function RoomDefinition({t, type, setType, status_val, setStatus, remark, setRemark}) {
    return (
        <div>
            <br></br> <br></br>
            <FormControl id='roomDefinition_setType' required={true} fullWidth>
                <InputLabel id='demo-simple-select-label'>{t('type')}</InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        data-testid='select_type'
                        value={type}
                        label={t('type')}
                        onChange={(e)=>setType(e.target.value)}
                    >
                        <MenuItem value={'Silence'}>{t('silence').toUpperCase()}</MenuItem>
                        <MenuItem value={'Normal'}>{t('normal').toUpperCase()}</MenuItem>
                    </Select>
            </FormControl>
            <br></br> <br></br>
            <FormControl id='roomDefinition_setStatus' required={true} fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    data-testid='select_status'
                    value={status_val}
                    label={t('status')}
                    onChange={(e)=>setStatus(e.target.value)}
                >
                    <MenuItem data-testid='select_status_enable' value={'enable'}>{t('enable').toUpperCase()}</MenuItem>
                    <MenuItem data-testid='select_status_disable' value={'disable'}>{t('disable').toUpperCase()}</MenuItem>
                </Select>
            </FormControl>
            <br></br> <br></br>
            <FormControl id='roomDefinition_setRemark' required={true} size='small' fullWidth variant='standard'>
            <TextField
                id='textfield_remark'
                label={t('roomRemark')}
                size='small'
                type={'text'}
                value={remark}
                onChange={(e)=>setRemark(e.target.value)}
            />
            </FormControl>
        </div>
    )
};