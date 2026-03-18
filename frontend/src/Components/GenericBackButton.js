import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colorVars } from '../theme';

const GenericBackButton = ({ onBack = null }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const normalizedPathname = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

    function back() {
        if (typeof onBack === 'function') {
            onBack();
            return;
        }
        if (normalizedPathname === '/carpark') {
            navigate('/home', { replace: true });
            return;
        }
        navigate(-1);
    }

    const StyledButton = styled(Button)({
        backgroundColor: colorVars.brand.accent,
        color: colorVars.text.inverse,
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1300,
        '&:hover': {
          backgroundColor: colorVars.brand.primaryPressed,
        },
      });
      return (
        <StyledButton id='generic_back_button' onClick={back} variant="contained">
            {t('back')}
        </StyledButton>
      );
};

export default GenericBackButton;
