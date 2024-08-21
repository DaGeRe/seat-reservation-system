import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

export default function DeleteRoom({ deleteRoomModal }) {
  // The jwt.
  const accessToken = localStorage.getItem('accessToken');
  const { t } = useTranslation();
    const [allRooms, setAllRooms] = React.useState([]);
    React.useEffect(() => {
        getAllRooms();
      }, []);

      async function getAllRooms(){
        const response = await fetch(`https://jus-srv-test30:${process.env.REACT_APP_BACKEND_PORT}/rooms`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      }).then(resp => {
        resp.json().then(data => {
          setAllRooms(data);
        });
      }).catch(error => {
        console.log("login user err " + error);
      });
      }

    const handleClose = () => {
        deleteRoomModal();
    }

    async function handleRoomTypeChange(e, id){

      const response = await fetch(`https://jus-srv-test30:${process.env.REACT_APP_BACKEND_PORT}/rooms/${id+"/type/"+e.target.value}`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      toast.success(t("roomType"));
      getAllRooms();
  }

    async function handleStatusChange(e, id){

        const response = await fetch(`https://jus-srv-test30:${process.env.REACT_APP_BACKEND_PORT}/rooms/${id+"/"+e.target.value}`, {
          method: "PUT",
          headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        toast.success(t("roomStatus"));
        getAllRooms();
    }

    async function deleteRoomById(id){
      const response = await fetch(`https://jus-srv-test30:${process.env.REACT_APP_BACKEND_PORT}/rooms/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      toast.success(t("roomDeleted"));
      getAllRooms();
  }

    return (
        <React.Fragment>
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
                                <TableCell sx={{textAlign: 'center', fontSize:14, width:'30%'   }} component="th" scope="row">
                                <Button onClick={() => deleteRoomById(row.id)}>{t("delete").toUpperCase()}</Button>
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