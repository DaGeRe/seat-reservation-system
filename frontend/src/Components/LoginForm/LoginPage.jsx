import { useState } from 'react';
import './LoginPage.css';
import { Box, Button,  FormControl, OutlinedInput, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUser } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import isEmail from '../misc/isEmail';
import InfoModal from '../InfoModal';
const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const news = '<br/><ul><li>Anmeldung mit Windowskennung ist möglich</li><li>Festlegen von Standardetage möglich</li></ul>';
  const wrapper_sx = {
    width: '420px',
    height: '370px',
    background: 'transparent',
    border: '2px solid rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(30px)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    color: '#FFDD00',
    borderRadius: '10px',
    padding: '30px 40px',
    position: 'relative'
  };

  const button_sx = {
    width: '100%',
    height: '45px',
    background: '#fff',
    border: 'none',
    outline: 'none',
    borderRadius: '40px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
    color: '#333',
    fontWeight: 700,
  }


  async function login() {

    if (!isEmail(email)) {
      setLoginError(t('invalidEmail'));
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:email, password:password}),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      if (data !== null) {
        sessionStorage.setItem('headers',  JSON.stringify({
          'Authorization': 'Bearer ' +  String(data['accessToken']),
          'Content-Type': 'application/json',
        }));
        localStorage.setItem('email', String(data.email));
        localStorage.setItem('userId', String(data.id));
        localStorage.setItem('name', String(data.name));
        localStorage.setItem('surname', String(data.surname));
        localStorage.setItem('admin', String(data.admin));
        localStorage.setItem('visibility', String(data.visibility));
        navigate('/home', { replace: true });
      } else {
        setLoginError(t('invalidCredentials'));
        return;
      }
    } catch (error) {
        toast.error(t('loginFailed'));
        setLoginError(t('loginFailed'));
    }
  }

  return (
    <>
    <Box sx={wrapper_sx}>
      <Box sx={{
          flexGrow: 1,
          overflowY: 'auto',
          px: 3, // paddingX
          py: 2, // paddingY
      }}>
        <h1 style={{margin: '20px', textAlign: 'center',}}>{t('login')}</h1>
        <br/>
        <img src={'/Assets/flag.png'} alt='Flag' className='flag-image' />
        <FormControl fullWidth required size='small'>
          <OutlinedInput
            id='email'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            endAdornment={
              <InputAdornment
                position='end'
                sx={{
                  backgroundColor: '#eef4ff',
                  borderTopRightRadius: '4px',
                  borderBottomRightRadius: '4px',
                  px: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FaUser/>
              </InputAdornment>
            }
            sx={{
              backgroundColor: '#eef4ff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0,0,0,0.23)',
              },
            }}
          />
        </FormControl>
        <br/><br/>

        <FormControl fullWidth required size='small'>
          <OutlinedInput
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment
                position='end'
                sx={{
                  backgroundColor: '#eef4ff', // ⬅️ identisch zum Feld
                  borderTopRightRadius: '4px',
                  borderBottomRightRadius: '4px',
                  px: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FaLock/>
              </InputAdornment>
            }
            sx={{
              backgroundColor: '#eef4ff', // ⬅️ wichtig!
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0,0,0,0.23)',
              },
            }}
          />
        </FormControl>
        <br/><br/>

        {loginError && <div data-testid='loginErrorMsg' className='error'>{loginError}</div>}
        <Button id='login_btn' type='submit'  color='primary' onClick={login} sx={button_sx}>
            {t('login')}
        </Button>
        
      </Box>
      
    </Box>
    <InfoModal text={`<h1>${t('news')}</h1>${news}`} helpIcon={false}/>
    </>
  );
};

export default LoginPage;
