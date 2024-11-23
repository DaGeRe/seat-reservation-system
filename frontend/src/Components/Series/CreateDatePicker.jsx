import { FormControl, TextField} from '@mui/material';
import DatePicker from 'react-datepicker';

const CreateDatePicker = ({date, setter, label}) => {
    return (
        <FormControl required fullWidth>
            <DatePicker
                selected={date}
                onChange={setter}
                locale='de'
                dateFormat='dd.MM.yyyy'
                placeholderText={label}
                showWeekNumbers
                isClearable
                customInput={
                    <TextField
                        label={label}
                        variant='outlined'
                        fullWidth
                        required
                    />
                }
            />
        </FormControl>
    );
};

export default CreateDatePicker;