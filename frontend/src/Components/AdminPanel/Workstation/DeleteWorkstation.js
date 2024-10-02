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
import DeleteFf from '../../DeleteFf/DeleteFf';
import {optionToDeskId, deskToOption} from './DeskAndOption'
import {deleteRequest} from '../../RequestFunctions/DeleteRequest';
import {getRequest} from '../../RequestFunctions/GetRequest';

export default function DeleteWorkstation({ deleteWorkstationModal }) {
 /*  const headers = {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
    'Content-Type': 'application/json',
  }; */
  const headers = JSON.parse(sessionStorage.getItem('headers'));
  const { t } = useTranslation();
  const [allRooms, setAllRooms] = React.useState([]);
  const [allDesks, setAllDesks] = React.useState([]);
  const [selectedRoom, setSelectedRoom]= React.useState('');
  const [selectedDesk, setSelectedDesk]= React.useState('');
  const [openFfDialog, setOpenFfDialog] = React.useState(false);

  React.useEffect(() => {
      getAllRooms();
  }, []);

  const handleClose = () => {
    deleteWorkstationModal();
  }

  async function getAllRooms() {
    /*     const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/status`, {
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
      `${process.env.REACT_APP_BACKEND_URL}/rooms/status`,
      setAllRooms,
      () => {console.log('Failed to fetch all rooms in DeleteWorkstation.js');},
      headers
    );
  };

  function getDeskByRoomId(e) {
    if(e) {
        let idSplit = e.split("(");
        let idVal = idSplit[1].split(")");
        let roomId = idVal[0];

/*         const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/desks/room/${roomId}`, {
        method: 'GET',
        headers: headers
      }).then(resp => {
        resp.json().then(data => {
          setAllDesks(data);
        });
      }).catch(error => {
        console.log('login user err ' + error);
      }); */
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/room/${roomId}`,
        setAllDesks,
        () => {console.log(`Failed to fetch all desks for roomid ${roomId} in DeleteWorkstation.js`);},
        headers
      );
    }
  };

  async function deleteWorkstation(){
    if(selectedDesk){   
/*       const url = `${process.env.REACT_APP_BACKEND_URL}/desks/${selectedDesk}`;
      try {
        fetch(url, {
          method: 'DELETE',
          headers: headers,
          body: JSON.stringify({})
        })
        .then(resp => {
          resp.json().then(data => {
            if (data != 0) {
              setOpenFfDialog(true);
            }
            else {
              toast.success(t('deskDelete'));
              deleteWorkstationModal();
            }
          })
        })
        .catch((error) => {
          console.log('fehler');
      });
    }catch (e) {
      console.log('nope');
    } */
      deleteRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/${selectedDesk}`,
        JSON.stringify({}),
        (data) => {
          if (data != 0) {
            setOpenFfDialog(true);
          }
          else {
            toast.success(t('deskDelete'));
            deleteWorkstationModal();
          }
        },
        () => {console.log('Failed to delete workstation in DeleteWorkstation.js');},
        headers
      );
    }
  }

  async function deleteWorkstationFf(){
    if(selectedDesk) {
/*       const url = `${process.env.REACT_APP_BACKEND_URL}/desks/ff/${selectedDesk}`;
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
            //setOpen(true);
          }
          else {
            console.error('unknown error');
          }
        }).catch((error) => {
          console.log('fehler deleteWorkstationFf');
        });
    }catch (e) {
      console.log('nope');
    } */
      deleteRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/ff/${selectedDesk}`,
        JSON.stringify({}),
        (_) => {
          toast.success(t('deskDelete'));
          deleteWorkstationModal();
        },
        () => {console.log('Failed to delete workstation fast forward in DeleteWorkstation.js.');},
        headers
      )
    }
  }
  
  return (
    <React.Fragment>
      <DeleteFf 
          open={openFfDialog}
          onClose={handleClose}
          onDelete={deleteWorkstationFf}
          text={t('fFDeleteWorkStation')}
        />
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
                  options={allDesks.map(deskToOption)}
                  value={selectedDesk}
                  // To avoid an warning allow every possible option.
                  isOptionEqualToValue={(option, value) => true === true}
                  onChange={(_, newValue) => {
                    const deskId = optionToDeskId(newValue);
                    setSelectedDesk(deskId);
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