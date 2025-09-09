import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getRequest } from '../../RequestFunctions/RequestFunctions';

export default function  MySelectComponent({t, _value, setValue, name, url, headers}) {
    const [values, setValues] = useState([]);
    // Fetch all values.
    useEffect(()=>{
        getRequest(
            `${process.env.REACT_APP_BACKEND_URL}/${url}`,
            headers.current,
            setValues,
            () => {
                console.log(`Error fetching ${url} in MySelectComponent.jsx`);
            }
        );
    }, []);
    // Set the value if it is not defined.
    useEffect(()=>{
        /**
         * First we check if the default room status is not defined or an empty string.
         * This means that the father component dont provide a default value for this.
         * In conclusion we set one status as default. 
         * This happens e.g. when we add a new room.
         */
        if (
            (!_value || _value === '') && values?.length > 0
        ) {
            setValue(values[0]);
        }
    }, [values, _value, setValue])

    return (
        <>
        <br></br> <br></br>
        <FormControl 
            id={'mySelectComponentSet' + name.charAt(0).toUpperCase() + name.slice(1)} 
            required={true} fullWidth
        >
            <InputLabel id={'mySelectComponentLabel' + name.charAt(0).toUpperCase() + name.slice(1)}>{t(name)}</InputLabel>
                {_value && values?.length > 0 && <Select
                    labelId={'mySelectComponentLabel' + name.charAt(0).toUpperCase() + name.slice(1)}
                    value={defaultRoomType.roomTypeName}
                    label={t('type')}
                    onChange={e=>{
                        const roomTypeName = e.target.value;
                        setDefaultRoomType(roomTypes.find(rt => rt.roomTypeName === roomTypeName));
                    }}
                >
                    {
                        roomTypes.map(roomType => {
                            return <MenuItem key={roomType.roomTypeId} value={roomType.roomTypeName}>{t(roomType.roomTypeName)}</MenuItem>
                        })
                    }
                </Select>}
        </FormControl>
        </>
    );
};