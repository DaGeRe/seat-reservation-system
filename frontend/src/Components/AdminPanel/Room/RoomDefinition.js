import { FormControl, TextField, InputLabel, MenuItem, Select} from '@mui/material';
import { useRef, useState, useEffect } from 'react';

import { getRequest } from '../../RequestFunctions/RequestFunctions';

export default function RoomDefinition({t, defaultRoomType, setDefaultRoomType, status_val, setStatus, remark, setRemark}) {
    const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
    const [roomTypes, setRoomTypes] = useState([]);
    // useEffect(()=>{
    //     console.log(roomTypes);
    // },[roomTypes]);
    // useEffect(()=>{
    //     console.log(defaultRoomType);
    // }, [defaultRoomType]);

    // Fetch all room types.
    useEffect(()=>{
        getRequest(
            `${process.env.REACT_APP_BACKEND_URL}/roomTypes`,
            headers.current,
            setRoomTypes,
            () => {
                console.log('Error fetching roomTypes in RoomDefinition.js');
            }
        );
    }, []);

    // Set the default room type if it is not defined.
    useEffect(()=>{
        /**
         * First we check if the default room type is not defined or an empty string.
         * This means that the father component dont provide a default value for this.
         * In conclusion we set one type as default. 
         * This happens e.g. when we add a new room.
         */
        if (
            (!defaultRoomType || defaultRoomType === '') &&
            (roomTypes && roomTypes.length > 0)
        ) {
            setDefaultRoomType(roomTypes[0]);
        }
    }, [roomTypes, defaultRoomType, setDefaultRoomType])

    return (
        <div>
            <br></br> <br></br>
            <FormControl id='roomDefinition_setType' required={true} fullWidth>
                <InputLabel id='demo-simple-select-label'>{t('type')}</InputLabel>
                    {defaultRoomType && roomTypes && roomTypes.length > 0 && <Select
                        labelId='demo-simple-select-label'
                        id='select_type'
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