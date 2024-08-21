import { FormControl, Grid, InputLabel, MenuItem, Paper, TextField, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

export default function EditRoom({ editRoomModal }) {
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
        editRoomModal();
    }

    async function handleRoomFloorChange(e, id){

      const response = await fetch(`https://jus-srv-test30:${process.env.REACT_APP_BACKEND_PORT}/rooms/${id+"/floor/"+e.target.value}`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      toast.success(t("floor"));
      getAllRooms();
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

        const response = await fetch(`https://jus-srv-test30:${process.env.REACT_APP_BACKEND_PORT}/rooms/${id}/${e.target.value}`, {
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

    return (
        <React.Fragment>
            <DialogContent>
                <Grid container >
                <TableContainer  component={Paper}>
      <Table sx={{ minWidth: 450, marginTop: 1, maxHeight:'400px' }} >
        <TableHead sx={{backgroundColor: 'green', color:'white'}}>
          <TableRow >
             
            <TableCell sx={{textAlign: 'center', fontSize:15, color:'white'}}>{t("floor")}</TableCell>
            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t("type")}</TableCell>
            <TableCell sx={{textAlign: 'center',fontSize:15,color:'white' }} colSpan={2}>{t("action")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allRooms.map((row) => (
            <TableRow  key={row.id}>
              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                <FormControl fullWidth size='small'>
                    <TextField
                      size='small'
                      id="demo-simple-select-floor"
                      value={row.floor}
                      label={t("floor")}
                      onChange={(e) => handleRoomFloorChange(e, row.id)}
                    >
                    </TextField>
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