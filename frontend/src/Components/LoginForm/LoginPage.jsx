import { useReducer/*, useState*/ } from 'react';
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
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  //const [loginError, setLoginError] = useState('');
  const initState = {
    email: '',
    password: '',
    loginError: ''
  };
  function reducer(state, action) {
    switch(action.type) {
      case 'reset': 
        return initState;
      case 'updateField':
        return {...state, [action.field]: action.value };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);

  //const news = '<br/><ul><li>Anmeldung mit Windowskennung ist möglich</li><li>Festlegen von Standardetage möglich</li><li>Es kann nach Buchungen von Kollegen gesucht werden</li><li>Es kann nach Räumen gemäß der Kapazität gesucht werden</li><li>Der Anwender kann seine Standardansicht in der Buchungsübersicht wählen</li></ul>';
  const news = '<style>'+
  '.newslistlist ul {'+
    'margin-left: 20px;'+
   ' list-style-type: circle;'+
  '}'+
'</style>'+
                '<br/>' +
                '<ul class="newslistlist">' +
                ' <li>Sobald die Session abgelaufen ist wird der Anwender wieder zur Loginseite navigiert.</li>' + 
                ' <li>Anmeldung mit Windowskennung ist möglich</li><li>Festlegen von Standardetage möglich</li>' + 
                ' <li>' +
                '   Es kann nach Buchungen von Kollegen gesucht werden:' +
                '   <ul>' +
                '     <li>Nach der Anmeldung links im Baum unter Suchen&rightarrow;Kollegen auswählen.</li>' +
                '     <li>In der ersten Zeile die E-Mail-Adressen ihrer Kollegen, durch Kommata getrennt, eingeben.</li>' +
                '     <li>In der zweiten Zeile muss ein Datum festgelegt werden.</li>' +
                '     <li>Optional kann in der dritten Zeile eine Gruppen ausgewählt werden. Die erste Zeile wird dann durch die E-Mail-Adressen der Mitglieder dieser Gruppe ersetzt.</li>' +
                '     <li>Suche starten.</li>' +
                '   </ul>' +
                ' </li>' +
                '</ul>';
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

    if (!isEmail(state.email.trim())) {
      //setLoginError(t('invalidEmail'));
      dispatch({ type: 'updateField', field: 'loginError', value: t('invalidEmail')});
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:state.email.trim(), password:state.password.trim()}),
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
        sessionStorage.setItem('accessToken', String(data['accessToken']));
        navigate('/home', { replace: true });
      } else {
        //setLoginError(t('invalidCredentials'));
        dispatch({ type: 'updateField', field: 'loginError', value: t('invalidCredentials')})
        return;
      }
    } catch (error) {
      toast.error(t('loginFailed'));
      //setLoginError(t('loginFailed'));
      dispatch({ type: 'updateField', field: 'loginError', value: t('loginFailed')});
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
            value={state.email}
            //onChange={(e) => setEmail(e.target.value)}
            onChange={e => dispatch({type: 'updateField', field: 'email', value: e.target.value})}
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
            //value={password}
            value={state.password}
            //onChange={(e) => setPassword(e.target.value)}
            onChange={e => dispatch({type: 'updateField', field: 'password', value:e.target.value})}
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

        {state.loginError && <div data-testid='loginErrorMsg' className='error'>{state.loginError}</div>}
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
