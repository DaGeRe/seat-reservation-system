import { FormControl, Grid, TextField, InputLabel, MenuItem, Select} from '@mui/material';
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
  const { t } = useTranslation();
  const [floor, setFloor] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [type, setType] = React.useState('');
  const [x, setX] = React.useState(0.0);
  const [y, setY] = React.useState(0.0);
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

  //   async function handleRoomTypeChange(e, id){

  //     await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${id+"/type/"+e.target.value}`, {
  //       method: "PUT",
  //       headers: {
  //         "Authorization": "Bearer " + accessToken,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({}),
  //     });
  //     toast.success(t("roomType"));
  //     addRoom()//getAllRooms();
  // }

    // async function handleStatusChange(e, id){

    //     await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/${id+"/"+e.target.value}`, {
    //       method: "PUT",
    //       headers: {
    //         "Authorization": "Bearer " + accessToken,
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({}),
    //     });
    //     toast.success(t("roomStatus"));
    //     addRoom();//getAllRooms();
    // }
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

    return (
        <React.Fragment>
            <DialogContent>
                <Grid container >
               
                 
                  <Box sx={{ flexGrow: 1, padding: '10px' }}>
                    {/* <FormControl required={true} size="small" fullWidth>
                      <InputLabel id="demo-simple-select-label-floor">{t("floor")}</InputLabel>
                      <Select
                        labelId="demo-simple-select-label-floor"
                        id="demo-simple-select-floor"
                        value={floor}
                        label={t("floor")}
                        onChange={(e)=>{
                          setFloor(e.target.value);}}
                      >
                        <MenuItem value={"First"}>{t("firstFloor").toUpperCase()}</MenuItem>
                        <MenuItem value={"Ground"}>{t("groundFloor").toUpperCase()}</MenuItem>
                      </Select>
                    </FormControl> */}
                    {/* <div className="image-wrapper"> */}
                    <div
                      onClick={(e) => {
                        // setX(e.pageX - e.target.offsetLeft);
                        // setY(e.pageY - e.target.offsetTop);
                        // console.log('e.page', e.pageX, e.pageY);
                        // console.log('e.target', e.target.offsetLeft, e.target.offsetTop);
                        // console.log('client: ', e.clientX, e.clientY);
                        // console.log('layer', e.layerX, e.layerY);
                        // console.log('click: ', x, y);
                        // //<Test>
                        // setX(e.layerX);
                        // setY(e.layerY);
                        // //</Test>
                        // console.log('---------------');
                      }  
                    }
                    >
                      <img id='myImage' className="myimage" src={floorImage} alt={`${floor === 'Ground' ? 'Ground' : 'First'} Floor`}
                        onClick={(e)=>{
                          // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

                          // const coordinatesDiv = document.getElementById('coordinates');
                          // const img = document.getElementById('myImage');
                          // const rect = img.getBoundingClientRect();
                          // const rect_length = rect.right - rect.left;
                          // const rect_height = rect.bottom - rect.top;
                          // const x = e.clientX - rect.left;
                          // const y = e.clientY - rect.top;
                          // const xPercent = (x / rect.width) * 100;
                          // const yPercent = (y / rect.height) * 100;
                          // //setX(e.layerX);
                          // //setY(e.layerY);
                          // console.log(rect);
                          // console.log('percent: ', xPercent, yPercent);
                          // console.log('natural: ', img.naturalWidth, img.naturalHeight);
                          
                          // const xPx=(xPercent/100)* rect.right;
                          // const yPx=(yPercent/100)*rect.bottom ;
                          // setX(xPx);
                          // setY(yPx);

                          const img = document.getElementById('myImage');
                          const rect = img.getBoundingClientRect();

                          setX(rect.right);
                          setY(rect.bottom);
                          
                          
                          //coordinatesDiv.innerHTML = `Coordinates: (${xPercent.toFixed(2)}%, ${yPercent.toFixed(2)}%)`;
                          
                        }}
                        onMouseMove={(e)=>{
                          const img = document.getElementById('myImage');
                          const rect = img.getBoundingClientRect();
                          const currx = e.clientX - rect.left;
                          const curry = e.clientY - rect.top;
                          const xPercent = (currx / rect.width) * 100;
                          const yPercent = (curry / rect.height) * 100;
                          
                          //console.log(xPercent, yPercent);
                
                          
                          setX((xPercent/100)*rect.width);
                          setX((e.pageX - e.target.offsetLeft));
                          setY((yPercent/100)*rect.height);
                          console.log(xPercent/100);
                          console.log(rect.width);
                          console.log(x);
                          console.log('-------');
                        }}
                      />
                      {/* { x != 0 && y != 0 && */}
                      <a className="myicon" style={{
                        top: `${y}px`, left: `${x}px` }}>
                    <IconButton>
                        <LaptopIcon />
                      </IconButton>
                      </a>
                    {/* }  */}
                    </div>
          
                    
                    {/* <br></br> <br></br>
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
                    </FormControl> */}

                    
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