import { FormControl, TextField, InputLabel, MenuItem, Select} from '@mui/material';
import { useRef, useState, useEffect } from 'react';

import { getRequest } from '../../RequestFunctions/RequestFunctions';

export default function RoomDefinition({t, defaultRoomType, setDefaultRoomType, defaultRoomStatus, setDefaultRoomStatus, remark, setRemark}) {
    const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
    const [roomTypes, setRoomTypes] = useState([]);
    const [roomStatuses, setRoomStatuses] = useState([]);
    // Fetch all room statuses.
    useEffect(()=>{
        getRequest(
            `${process.env.REACT_APP_BACKEND_URL}/roomStatuses`,
            headers.current,
            setRoomStatuses,
            () => {
                console.log('Error fetching roomTypes in RoomDefinition.js');
            }
        );
    }, []);

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

    // Set the default room statuses if it is not defined.
    useEffect(()=>{
        /**
         * First we check if the default room status is not defined or an empty string.
         * This means that the father component dont provide a default value for this.
         * In conclusion we set one status as default. 
         * This happens e.g. when we add a new room.
         */
        if (
            (!defaultRoomStatus || defaultRoomStatus === '') &&
            (roomStatuses && roomStatuses.length > 0)
        ) {
            setDefaultRoomStatus(roomStatuses[0]);
        }
    }, [roomStatuses, defaultRoomStatus, setDefaultRoomStatus])

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
                    {defaultRoomType && roomTypes?.length > 0 && <Select
                        labelId='demo-simple-select-label'
                        id='select_type'
                        value={defaultRoomType.roomTypeName}
                        label={t('type')}
                        onChange={e=>{
                            const roomTypeName = e.target.value;
                            setDefaultRoomType(roomTypes.find(rt => rt.roomTypeName === roomTypeName));
                        }}
                    >
                        {roomTypes.map(roomType => {
                            return <MenuItem key={roomType.roomTypeId} value={roomType.roomTypeName}>{t(roomType.roomTypeName)}</MenuItem>
                        })}
                    </Select>}
            </FormControl>
            <br></br> <br></br>
            <FormControl id='roomDefinition_setStatus' required={true} fullWidth>
                <InputLabel id='demo-simple-select-label'>Status</InputLabel>
                {defaultRoomStatus && roomStatuses?.length > 0 && <Select
                    labelId='demo-simple-select-label'
                    value={defaultRoomStatus.roomStatusName}
                    label={t('status')}
                    onChange={e=>{
                        const roomStatusName = e.target.value;
                        setDefaultRoomStatus(roomStatuses.find(rs => rs.roomStatusName === roomStatusName));
                    }}
                >
                    {roomStatuses.map(roomStatus => {
                        return <MenuItem key={roomStatus.roomStatusId} value={roomStatus.roomStatusName}>{t(roomStatus.roomStatusName)}</MenuItem>
                    })}
                </Select>}
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