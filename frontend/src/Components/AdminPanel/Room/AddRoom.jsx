import { FormControl, Tooltip, TooltipProps, tooltipClasses, Grid, FormHelperText, TextField, InputLabel, Input, MenuItem, Select} from '@mui/material';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import firstFloorImage from '../../../images/firstfloor.png';
import secondFloorImage from '../../../images/secondfloor.png'; 

import './AddRoom.css'; 
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import LaptopIcon from '@mui/icons-material/Laptop';

export default function AddRoom({ addRoomModal }) {
  // The jwt.
  const accessToken = localStorage.getItem('accessToken');
  const [isOverImage, setIsOverImage] = React.useState(false);
  const [allRooms, setAllRooms] = React.useState([]);
  const { t } = useTranslation();
  const [floor, setFloor] = React.useState('Ground');
  const [status, setStatus] = React.useState('');
  const [type, setType] = React.useState('');
  const [x, setX] = React.useState(0.0);
  const [y, setY] = React.useState(0.0);
  const [remark, setRemark] = React.useState('');
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
        getAllRooms();
      }, []);
  
    async function getAllRooms(){
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/status`, {
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

  async function addRoom() {
    if (!floor || !type || !x || !y) {
      toast.error(t('fields_not_empty'));
      return false;
    }
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/create`, {
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
          "y": y,
          "remark": remark
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

    const floorImage = floor === 'Ground' ? firstFloorImage : secondFloorImage;
    
    const handleMouseClick = (e) => {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left; // X coordinate within the image
      const y = e.clientY - rect.top; // Y coordinate within the image
  
      setX(x);
      setY(y);
    }

    const HtmlTooltip = styled(({ className, ...props }) => (
      <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: '#f5f5f9',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: 220,
          fontSize: theme.typography.pxToRem(12),
          border: '1px solid #dadde9',
        },
    }));

    return (
      <React.Fragment>
          <DialogContent>
              <Grid container >
                <Box sx={{ flexGrow: 1, padding: '10px' }}>
                  <FormControl required={true} size="small" fullWidth>
                    <InputLabel id="demo-simple-select-label-floor">{t("floor")}</InputLabel>
                    <Select
                      labelId="demo-simple-select-label-floor"
                      id="demo-simple-select-floor"
                      value={floor}
                      label={t("floor")}
                      onChange={(e)=>{
                        setFloor(e.target.value);
                        getAllRooms();
                      }}   
                    >
                      <MenuItem value={"First"}>{t("firstFloor").toUpperCase()}</MenuItem>
                      <MenuItem value={"Ground"}>{t("groundFloor").toUpperCase()}</MenuItem>
                    </Select>
                  </FormControl>
                  <br></br> <br></br>
                  <div
                    className="image-container"
                    onMouseDown={handleMouseClick}
                  >
                    <img src={floorImage} alt="Example" className="floor-image" />
                    {x != 0 && y!= 0 && (
                      <div
                        className="image-icon"
                        style={{
                          top: `${y}px`,
                          left: `${x}px`
                        }}
                      >
                        <IconButton>
                          <LaptopIcon style={{ color: 'blue'}}/>
                        </IconButton>
                      </div>
                    )}
                    {
                      allRooms
                      .filter((room) => {
                        return room.floor === floor
                      })
                      .map((room, i) => {
                        return (
                          
                            <div 
                              key={i}
                              className="image-icon"
                              style={{
                                top: `${room.y}px`,
                                left: `${room.x}px`
                              }}
                            >
                              <HtmlTooltip
                                title={
                                  <React.Fragment>
                                    <em>x: {room.x} y: {room.y}</em>
                                    <br></br>
                                    <em>{room.remark}</em>
                                  </React.Fragment>
                                }
                              >
                                <IconButton>
                                  <LaptopIcon style={{ color: 'grey'}}/>
                                </IconButton>
                              </HtmlTooltip>
                            </div>
                        );
                      })
                    }
                  </div>
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
                        id="room-"
                        label={t("roomRemark")}
                        size="small"
                        type={"text"}
                        value={remark}
                        onChange={(e)=>setRemark(e.target.value)}
                    />
                  </FormControl>
                  <br></br> <br></br>
                  <FormControl  required={true} size="small" fullWidth variant="standard">
                    <Box display="flex" justifyContent="space-between">
                      <TextField
                        id="standard-adornment-reason"
                        label={t("x")}
                        InputProps={{
                          readOnly: true,
                        }}
                        size="small"
                        type={"text"}
                        value={x}
                      />
                      <TextField
                        id="standard-adornment-reason"
                        label={t("y")}
                        InputProps={{
                          readOnly: true,
                        }}
                        size="small"
                        type={"text"}
                        value={y}
                      />
                    </Box>
                  </FormControl>
                  <DialogActions>
                    <Button onClick={()=>addRoom()}>&nbsp;{t("submit").toUpperCase()}</Button>
                    <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
                  </DialogActions>
                </Box>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
          </DialogActions>
      </React.Fragment>
    );
}