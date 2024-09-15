import {Grid, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

export default function DeleteWorkstation({ deleteWorkstationModal }) {
  // The jwt.
  const accessToken = localStorage.getItem('accessToken');
  const [open, setOpen] = React.useState(false);
  const headers = {
    'Authorization': 'Bearer ' + accessToken,
    'Content-Type': 'application/json',
  };
  const { t } = useTranslation();
  const [allRooms, setAllRooms] = React.useState([]);
  const [allDesks, setAllDesks] = React.useState([]);
  const [selectedRoom, setSelectedRoom]= React.useState('');
  const [selectedDesk, setSelectedDesk]= React.useState('');
  React.useEffect(() => {
      getAllRooms();
  }, []);

  const handleClose = () => {
    deleteWorkstationModal();
  }

  async function getAllRooms(){
    const url = `${process.env.REACT_APP_BACKEND_URL}/rooms/status`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    }).then(resp => {
      resp.json().then(data => {
        setAllRooms(data);
      });
    }).catch(error => {
      console.log("login user err " + error);
    });
  }

  async function getDeskByRoomId(e){
    if(e){
        let idSplit = e.split("(");
        let idVal = idSplit[1].split(")");
        let roomId = idVal[0];

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/desks/room/${roomId}`, {
        method: "GET",
        headers: headers
      }).then(resp => {
        resp.json().then(data => {
          setAllDesks(data);
        });
      }).catch(error => {
        console.log("login user err " + error);
      });
    }
  }

  async function deleteWorkstation(){
    if(selectedDesk){
   
      const url = `${process.env.REACT_APP_BACKEND_URL}/desks/${selectedDesk}`;
      console.log(url);
      try {
      /*await */fetch(url, {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify({})
      })
      .then(resp => {
        if (resp.ok) {
          toast.success(t("deskDelete"));
          deleteWorkstationModal();
        }
        else if (resp.status === 400) {
          setOpen(true);
        }
        else {
          console.error('unknown error');
        }
      }).catch((error) => {
        //console.log("login user err " + error);
        console.log('fehler');
      });
    }catch (e) {
      console.log('nope');
    }
    }
  }

  async function deleteWorkstationFf(){
    if(selectedDesk){
      const url = `${process.env.REACT_APP_BACKEND_URL}/desks/ff/${selectedDesk}`;
      try {
      await fetch(url, {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify({})
      })
      .then(resp => {
        if (resp.ok) {
          toast.success(t("deskDelete"));
          deleteWorkstationModal();
        }
        else if (resp.status === 400) {
          setOpen(true);
        }
        else {
          console.error('unknown error');
        }
      }).catch((error) => {
        //console.log("login user err " + error);
        console.log('fehler');
      });
    }catch (e) {
      console.log('nope');
    }
    }
  }
  

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {t("fFDeleteWorkStation")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("no")}</Button>
          <Button onClick={deleteWorkstationFf} autoFocus>
            {t("yes")}
          </Button>
        </DialogActions>
      </Dialog>
      <DialogContent>
        <Grid container >
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <Autocomplete
              id="tags-filled"
              fullWidth
              options={allRooms.map((option) => (option.floor +"-"+ option.type +"("+option.id+") " + option.remark))}
              value={selectedRoom}
              // To avoid an warning allow every possible option.
              isOptionEqualToValue={(option, value) => true === true}
              onChange={(event, newValue) => {
                setSelectedDesk("");
                getDeskByRoomId(newValue);
                setSelectedRoom(newValue);
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
            <br></br> {
              allDesks && allDesks.length > 0 ? (
                <Autocomplete
                  id="tags-filled"
                  fullWidth
                  options={allDesks.map((option) => (option.id.toString()))}
                  value={selectedDesk}
                  // To avoid an warning allow every possible option.
                  isOptionEqualToValue={(option, value) => true === true}
                  onChange={(event, newValue) => {
                    setSelectedDesk(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size='small' 
                      label={t("selectDesk")}
                      placeholder={t("selectDesk")}
                    />
                  )}
                />
              ):<p style={{color: 'red', textAlign:'left'}}>{t("deskNotFound")}</p>
            }
            </Box>
          </Grid>
        </DialogContent>
      <DialogActions>
        <Button onClick={()=>deleteWorkstation()}>&nbsp;{t("delete").toUpperCase()}</Button>
        <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}