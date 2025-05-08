import { useState } from 'react';
import './LoginPage.css';
import { FaUser } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import isEmail from '../misc/isEmail';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  //const news = '';

  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isEmail(values.email)) {
      setLoginError(t('invalidEmail'));
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
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
        localStorage.setItem("email", String(data.email));
        localStorage.setItem("userId", String(data.id));
        localStorage.setItem("name", String(data.name));
        localStorage.setItem("surname", String(data.surname));
        localStorage.setItem("admin", String(data.admin));
        localStorage.setItem("visibility", String(data.visibility));
        navigate("/home", { replace: true });
      } else {
        setLoginError(t('invalidCredentials'));
        return;
      }
    } catch (error) {
        toast.error(t('loginFailed'));
        setLoginError(t('loginFailed'));
    }
  };

  return (
    <div className="wrapper">
      <img src={'/Assets/flag.png'} alt="Flag" className="flag-image" />
      <form>
        <h1>{t("login")}</h1>
        <div className="input-box">
          <input
            id="email"
            data-testid='email'
            onChange={(e) =>
              setValues({ ...values, email: e.target.value.trim() })
            }
            type="text"
            placeholder={t("email")}
            required
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            id="password"
            data-testid='password'
            onChange={(e) =>
              setValues({ ...values, password: e.target.value.trim() })
            }
            type="password"
            placeholder={t("password")}
            required
          />
          <FaLock className="icon" />
        </div>
{/*         <div className="forgot-password">
          <a href="/">{t("forgotPassword")}?</a>
        </div> */}
        {loginError && <div data-testid='loginErrorMsg' className="error">{loginError}</div>}
        <button data-testid='loginBtn' type="submit" onClick={handleLogin}>
          {t("login")}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
