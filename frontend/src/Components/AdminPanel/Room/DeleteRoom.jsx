import {Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
/* import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'; */
import DeleteFf from '../../DeleteFf/DeleteFf';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {getRequest,deleteRequest} from '../../RequestFunctions/RequestFunctions';

export default function DeleteRoom({ deleteRoomModal }) {
  const headers = JSON.parse(sessionStorage.getItem('headers'));
  const [openFfDialog, setOpenFfDialog] = React.useState(false);
  const [currRoomId, setCurrRoomId] = React.useState(-1);
  const { t } = useTranslation();
  const [allRooms, setAllRooms] = React.useState([]);
  
  React.useEffect(() => {
    getAllRooms();
  }, []);

  async function getAllRooms(){
    /* const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms`, {
      method: 'GET',
      headers: headers,
    }).then(resp => {
      resp.json().then(data => {
        setAllRooms(data);
      });
    }).catch(error => {
      console.log("login user err " + error);
    }); */
    getRequest(
      `${process.env.REACT_APP_BACKEND_URL}/rooms`,
      headers,
      setAllRooms,
      () => {'Failed to fetch rooms in DeleteRoom.jsx.'},

    )
  }

  const handleClose = () => {
      deleteRoomModal();
  }

  async function deleteRoomById(id){
/*     const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${id}`, {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({}),
    })
    .then(resp => {
      resp.json().then(data => {
        if (data != 0) {
          setOpenFfDialog(true);
        }
        else {
          toast.success(t("roomDeleted"));
          getAllRooms();
        }
      });
    }); */
    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/rooms/${id}`,
      JSON.stringify({}),
      (data) => {
        if (data != 0) {
          setOpenFfDialog(true);
        }
        else {
          toast.success(t('roomDeleted'));
          getAllRooms();
        }
      },
      () => {'Failed to delete room in DeleteRoom.jsx.'},
      headers
    );
  }

  async function deleteRoomFf(){
    if (currRoomId === -1) {
      toast.error('select an room');
    }
    else {
/*       const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/ff/${currRoomId}`, {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify({}),
      });
      if (response.ok) {
        toast.success(t("roomDeleted"));
        getAllRooms();
      } */
      deleteRequest(
        `${process.env.REACT_APP_BACKEND_URL}/rooms/ff/${currRoomId}`,
        JSON.stringify({}),
        (_) => {
          toast.success(t('roomDeleted'));
          getAllRooms();
        },
        headers
      );
    }
  } 

  return (
      <React.Fragment>
          <DeleteFf 
            open={openFfDialog}
            onClose={handleClose}
            onDelete={deleteRoomFf}
            text={t("fFDeleteRoom")}
          />
          <DialogContent>
              <Grid container >
                    <TableContainer  component={Paper}>
                      <Table sx={{ minWidth: 450, marginTop: 1, maxHeight:'400px' }} >
                        <TableHead sx={{backgroundColor: 'green', color:'white'}}>
                          <TableRow>
                            <TableCell sx={{textAlign: 'center', fontSize:15, color:'white'}}>{t("floor")}</TableCell>
                            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t("status")}</TableCell>
                            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t("type")}</TableCell>
                            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t("x")}</TableCell>
                            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t("y")}</TableCell>
                            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t("roomRemark")}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {allRooms.map((row) => (
                            <TableRow  key={row.id}>
                              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                                {row.floor}
                              </TableCell>
                            <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                                {row.status}
                              </TableCell>
                              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                                {row.type}
                              </TableCell>
                              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                                {row.x}
                              </TableCell>
                              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                                {row.y}
                              </TableCell>
                              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                                {row.remark}
                              </TableCell>
                              <TableCell sx={{textAlign: 'center', fontSize:14, width:'30%'   }} component="th" scope="row">
                              <Button onClick={() => {
                                  setCurrRoomId(row.id);
                                  deleteRoomById(row.id);
                                }
                              }
                              >{t('delete').toUpperCase()}</Button>
                            </TableCell>

                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>&nbsp;{t('close').toUpperCase()}</Button>
        </DialogActions>
      </React.Fragment>
    );
}