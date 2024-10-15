import { FormControl, Grid, InputLabel, MenuItem, Paper, TextField, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {getRequest, putRequest} from '../../RequestFunctions/RequestFunctions';

export default function EditRoom({ editRoomModal }) {
    const headers = JSON.parse(sessionStorage.getItem('headers'));
    const { t } = useTranslation();
    const [allRooms, setAllRooms] = React.useState([]);
    React.useEffect(() => {
        getAllRooms();
      }, []);

    async function getAllRooms(){
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/rooms`,
        headers,
        setAllRooms,
        () => {'Failed to fetch rooms in DeleteRoom.jsx.'},
      )
    }

    const handleClose = () => {
        editRoomModal();
    }

    async function handleRoomFloorChange(e, id){
      putRequest(
        `${process.env.REACT_APP_BACKEND_URL}/rooms/${id}/floor/${e.target.value}`,
        headers,
        (_) => {
          toast.success(t('floor'));
          getAllRooms();
        },
        () => {console.log('Failed to handle floor change in EditRoom.jsx');},
        JSON.stringify({})
      )
  }

  async function handleRoomRemarkChange(e, id){
/*     await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${id}/remark/${e.target.value}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({}),
    });
    toast.success(t("roomRemark"));
    getAllRooms(); */
    putRequest(
      `${process.env.REACT_APP_BACKEND_URL}/rooms/${id}/remark/${e.target.value}`,
      headers,
      (_) => {
        toast.success(t('roomRemark'));
        getAllRooms();
      },
      () => {console.log('Failed to handle room remark change in EditRoom.jsx');},
      JSON.stringify({})
    )
  }

    async function handleRoomTypeChange(e, id){
      /* await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${id}/type/${e.target.value}`, {  
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({}),
      });
      toast.success(t('roomType'));
      getAllRooms(); */
      putRequest( 
        `${process.env.REACT_APP_BACKEND_URL}/rooms/${id}/type/${e.target.value}`,
        headers,
        (_) => {
          toast.success(t('roomType'));
          getAllRooms();
        },
        () => {console.log('Failed to handle room type change in EditRoom.jsx');},
        JSON.stringify({})
      );
    }

    async function handleStatusChange(e, id){

        putRequest( 
          `${process.env.REACT_APP_BACKEND_URL}/rooms/${id}/${e.target.value}`,
          headers,
          (_) => {
            toast.success(t('roomStatus'));
            getAllRooms();
          },
          () => {console.log('Failed to handle room status change in EditRoom.jsx');}
        );
    }

    return (
        <React.Fragment>
            <DialogContent>
                <Grid container >
                  <TableContainer  component={Paper}>
                    <Table sx={{ minWidth: 450, marginTop: 1, maxHeight:'400px' }} >
                      <TableHead sx={{backgroundColor: 'green', color:'white'}}>
                        <TableRow >
                          <TableCell sx={{textAlign: 'center', fontSize:15, color:'white'}}>{t('floor')}</TableCell>
                          <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t('type')}</TableCell>
                          <TableCell sx={{textAlign: 'center',fontSize:15,color:'white' }}>{t('action')}</TableCell>
                          <TableCell sx={{textAlign: 'center',fontSize:15,color:'white' }}>{t('roomRemark')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allRooms.map((row) => (
                          <TableRow  key={row.id}>
                            <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                              <FormControl fullWidth size='small'>
                                <InputLabel id='demo-simple-select-label-floor'>{t('floor')}</InputLabel>
                                <Select
                                  labelId='demo-simple-select-label-floor'
                                  id='demo-simple-select-floor'
                                  value={row.floor}
                                  label={t('floor')}
                                  onChange={(e) => handleRoomFloorChange(e, row.id)} 
                                >
                                  <MenuItem value={'First'}>{t('firstFloor').toUpperCase()}</MenuItem>
                                  <MenuItem value={'Ground'}>{t('groundFloor').toUpperCase()}</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell sx={{fontSize:14, width:'30%'   }} component="th" scope="row">
                <FormControl fullWidth size='small'>
                  <InputLabel id="demo-simple-select-label">{t("type")}</InputLabel>
                  <Select
                    size='small'
                    id="demo-simple-select"
                    value={row.type}
                    label={t("type")}
                    onChange={(e) => handleRoomTypeChange(e, row.id)}
                  >
                    <MenuItem value={"Silence"}>{t("silence").toUpperCase()}</MenuItem>
                    <MenuItem value={"Normal"}>{t("normal").toUpperCase()}</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              
              <TableCell sx={{fontSize:14, width:'30%'   }} component="th" scope="row">
                <FormControl fullWidth size='small'>
                  <InputLabel id="demo-simple-select-label">{t("status")}</InputLabel>
                  <Select
                    size='small'
                    id="demo-simple-select"
                    value={row.status}
                    label={t("status")}
                    onChange={(e) => handleStatusChange(e, row.id)}
                  >
                    <MenuItem value={"enable"}>{t("enable").toUpperCase()}</MenuItem>
                    <MenuItem value={"disable"}>{t("disable").toUpperCase()}</MenuItem>
                </Select>
                </FormControl>
              </TableCell>

              <TableCell sx={{fontSize:14, width:'30%'   }} component="th" scope="row">
                <FormControl fullWidth size='small'>
                  {row.remark && ( 
                    <TextField
                        size='small'
                        id="demo-simple-select-floor"
                        value={row.remark}
                        label={t("roomRemark")}
                        onChange={(e) => handleRoomRemarkChange(e, row.id)}
                      >
                  </TextField>
                  )}
                  {
                    !row.remark && (
                      <TextField
                      size='small'
                      id="demo-simple-select-floor"
                      value=''
                      label={t("roomRemark")}
                      onChange={(e) => handleRoomRemarkChange(e, row.id)}
                    >
                </TextField>
                    )
                  }
                </FormControl>
             </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
                    </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
            </DialogActions>
        </React.Fragment>
    );
}