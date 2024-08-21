import { FormControl, Grid, TextField, InputLabel, MenuItem, Select} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

export default function AddRoom({ addRoomModal }) {
  // The jwt.
  const accessToken = localStorage.getItem('accessToken');
  const { t } = useTranslation();
  const [floor, setFloor] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [type, setType] = React.useState('');
  const [x, setX] = React.useState('');
  const [y, setY] = React.useState('');
  // +---------+--------------+------+-----+---------+-------+
    // | Field   | Type         | Null | Key | Default | Extra |
    // +---------+--------------+------+-----+---------+-------+
    // | floor   | varchar(255) | NO   |     | NULL    |       |
    // | status  | varchar(255) | YES  |     | NULL    |       |
    // | type    | varchar(255) | NO   |     | NULL    |       |
    // | x       | int(11)      | NO   |     | NULL    |       |
    // | y       | int(11)      | NO   |     | NULL    |       |
    // +---------+--------------+------+-----+---------+-------+
    //const [allRooms, setAllRooms] = React.useState([]);
    React.useEffect(() => {
        //getAllRooms();
      }, []);

  async function addRoom() {
    if (!floor || !type || !x || !y) {
      toast.error(t('fields_not_empty'));
      return false;
    }
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/create`, {
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          "floor": floor,
          "status": status,
          "type": type,
          "x": x,
          "y": y
      })
    }).then(resp => {
      toast.success(t("roomCreated"));
      addRoomModal();
    }).catch(error => {
      toast.error(t("roomCreationFailed"));
      console.log("room creation err " + error);
    });
  }
    const handleClose = () => {
        addRoomModal();
    }

    async function handleRoomTypeChange(e, id){

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${id+"/type/"+e.target.value}`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      toast.success(t("roomType"));
      addRoom()//getAllRooms();
  }

    async function handleStatusChange(e, id){

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${id+"/"+e.target.value}`, {
          method: "PUT",
          headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        toast.success(t("roomStatus"));
        addRoom();//getAllRooms();
    }
    // +---------+--------------+------+-----+---------+-------+
    // | Field   | Type         | Null | Key | Default | Extra |
    // +---------+--------------+------+-----+---------+-------+
    // | room_id | bigint(20)   | NO   | PRI | NULL    |       |
    // | floor   | varchar(255) | NO   |     | NULL    |       |
    // | status  | varchar(255) | YES  |     | NULL    |       |
    // | type    | varchar(255) | NO   |     | NULL    |       |
    // | x       | int(11)      | NO   |     | NULL    |       |
    // | y       | int(11)      | NO   |     | NULL    |       |
    // +---------+--------------+------+-----+---------+-------+
    return (
        <React.Fragment>
            <DialogContent>
                <Grid container >
                  <Box sx={{ flexGrow: 1, padding: '10px' }}>
                    <FormControl required={true} size="small" fullWidth variant="standard">
                      <TextField
                        id="standard-adornment-reason"
                        label={t("floor")}
                        size="small"
                        type={"text"}
                        value={floor}
                        onChange={(e)=>setFloor(e.target.value)}
                      />
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                      <InputLabel id="demo-simple-select-label">{t("type")}</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label={t("type")}
                        onChange={(e)=>setType(e.target.value)}
                      >
                        <MenuItem value={"Silence"}>{t("silence").toUpperCase()}</MenuItem>
                        <MenuItem value={"Normal"}>{t("normal").toUpperCase()}</MenuItem>
                      </Select>
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                      <InputLabel id="demo-simple-select-label">Status</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label={t("status")}
                        onChange={(e)=>setStatus(e.target.value)}
                      >
                        <MenuItem value={"enable"}>{t("enable").toUpperCase()}</MenuItem>
                        <MenuItem value={"disable"}>{t("disable").toUpperCase()}</MenuItem>
                      </Select>
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} size="small" fullWidth variant="standard">
                      <TextField
                        id="standard-adornment-reason"
                        label={t("x")}
                        size="small"
                        type={"text"}
                        value={x}
                        onChange={(e)=>setX(e.target.value)}
                      />
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} size="small" fullWidth variant="standard">
                      <TextField
                        id="standard-adornment-reason"
                        label={t("y")}
                        size="small"
                        type={"text"}
                        value={y}
                        onChange={(e)=>setY(e.target.value)}
                      />
                    </FormControl>

                    
      <DialogActions>
        <Button onClick={()=>addRoom()}>&nbsp;{t("submit").toUpperCase()}</Button>
        <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
      </DialogActions>


            {/* <Autocomplete
              id="tags-filled"
              fullWidth
              options={allRooms.map((option) => (option.floor +"-"+ option.type +"("+option.id+")"))}
              value={selectedRoom}
              onChange={(event, newValue) => {
                  console.log(newValue);
                  setSelectedRoom(
                      newValue);
              }}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      variant="outlined"
                      size='small' 
                      label={t("selectRoom")}
                      placeholder={t("selectRoom")}
                  />
              )}
            />
            <br></br>
            <FormControl required={true} size="small" fullWidth variant="standard">
              <TextField
                id="standard-adornment-reason"
                label={t("deskID")}
                size="small"
                type={"number"}
                value={deskId}
                onChange={(e)=>setDeskId(e.target.value)}
              />
            </FormControl>
            <br></br><br></br>
            <FormControl fullWidth size='small'>
              <InputLabel id="demo-simple-select-label">{t("equipment")}</InputLabel>
              <Select
                size='small'
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={equipment}
                placeholder='Equipments'
                label="Equipments"
                onChange={(e) => setEquipment(e.target.value)}
              >
                <MenuItem value={"with equipment"}>{t("withEquipment").toUpperCase()}</MenuItem>
                <MenuItem value={"without equipment"}>{t("withoutEquipment").toUpperCase()}</MenuItem>
              </Select>
            </FormControl> */}
          </Box>
                {/* <TableContainer  component={Paper}>
      <Table sx={{ minWidth: 450, marginTop: 1, maxHeight:'400px' }} >
        <TableHead sx={{backgroundColor: 'green', color:'white'}}>
          <TableRow>
          <TableCell sx={{textAlign: 'center', fontSize:15, color:'white'}}> ID</TableCell>
             
            <TableCell sx={{textAlign: 'center', fontSize:15, color:'white'}}>{t("floor")}</TableCell>
            <TableCell sx={{textAlign: 'center', fontSize:15,color:'white' }}>{t("type")}</TableCell>
             <TableCell sx={{textAlign: 'center',fontSize:15,color:'white' }} colSpan={2}>{t("action")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allRooms.map((row) => (
            <TableRow  key={row.categoryId}>
              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                {row.floor === "Ground" ? t("groundFloor") : t("firstFloor")}
              </TableCell>
              
              <TableCell sx={{fontSize:14, width:'30%'   }} component="th" scope="row">
              <FormControl fullWidth size='small'>
                <InputLabel id="demo-simple-select-label">{t("type")}</InputLabel>
                <Select
                size='small'
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={row.type}
                    label="Status"
                    onChange={(e) => handleRoomTypeChange(e, row.id)}
                >
                    <MenuItem value={"Silence"}>{t("silence")}</MenuItem>
                    <MenuItem value={"Normal"}>{t("normal")}</MenuItem>
                </Select>
                </FormControl>
             </TableCell>
              
              <TableCell sx={{fontSize:14, width:'30%'   }} component="th" scope="row">
              <FormControl fullWidth size='small'>
                <InputLabel id="demo-simple-select-label">{t("status")}</InputLabel>
                <Select
                size='small'
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={row.status?row.status:"enable"}
                    label="Status"
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
    </TableContainer> */}
                    </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
            </DialogActions>
        </React.Fragment>
    );
}