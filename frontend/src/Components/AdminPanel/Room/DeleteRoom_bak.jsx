import {Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DeleteFf from '../../DeleteFf/DeleteFf';
import React, { useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {getRequest, deleteRequest} from '../../RequestFunctions/RequestFunctions';

export default function DeleteRoom({ deleteRoomModal }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const [openFfDialog, setOpenFfDialog] = React.useState(false);
  const [currRoomId, setCurrRoomId] = React.useState(-1);
  const { t } = useTranslation();
  const [allRooms, setAllRooms] = React.useState([]);
  const getAllRooms = useCallback(
    async () => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/rooms`,
        headers,
        setAllRooms,
        () => {'Failed to fetch rooms in DeleteRoom.jsx.'},
      );
    },
    [headers, setAllRooms]
  );
  
  React.useEffect(() => {
    getAllRooms();
  }, [getAllRooms]);



  const handleClose = () => {
      deleteRoomModal();
  }

  async function deleteRoomById(id){
    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/rooms/${id}`,
      headers,
      (data) => {
        if (data !== 0) {
          setOpenFfDialog(true);
        }
        else {
          toast.success(t('roomDeleted'));
          getAllRooms();
        }
      },
      () => {'Failed to delete room in DeleteRoom.jsx.'},
      
    );
  }

  async function deleteRoomFf(){
    if (currRoomId === -1) {
      toast.error('select an room');
    }
    else {
      deleteRequest(
        `${process.env.REACT_APP_BACKEND_URL}/rooms/ff/${currRoomId}`,
        headers,
        (_) => {
          toast.success(t('roomDeleted'));
          getAllRooms();
        }
      );
    }
  } 

  return (
      <React.Fragment>
          <DeleteFf 
            open={openFfDialog}
            onClose={handleClose}
            onDelete={deleteRoomFf}
            text={t('fFDeleteRoom')}
          />
          <DialogContent>
              <Grid2 container >
                    <TableContainer  component={Paper}>
                      <Table sx={{ minWidth: 450, marginTop: 1, maxHeight:'400px' }} >
                        <TableHead sx={{backgroundColor: 'green', color:'white'}}>
                          <TableRow>
                            <TableCell sx={{textAlign: 'center', fontSize:15, color:'white'}}>{t('floor')}</TableCell>
                            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t('status')}</TableCell>
                            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t('type')}</TableCell>
                            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t('roomRemark')}</TableCell>
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
                  </Grid2>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>&nbsp;{t('close').toUpperCase()}</Button>
        </DialogActions>
      </React.Fragment>
    );
}