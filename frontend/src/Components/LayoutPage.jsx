import SidebarComponent from './Home/SidebarComponent';
import { Box } from '@mui/material';
import InfoModal from './InfoModal/InfoModal';
import GenericBackButton from './GenericBackButton';
import {LayoutPage_theme} from './LayoutPage.theme.js';

const LayoutPage = ({title, helpText, useGenericBackButton=false, children}) => {
    return (
        <Box
            sx={LayoutPage_theme.pageWrapper}
        >
            <SidebarComponent />
        
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                px: 3, // paddingX
                py: 2, // paddingY
            }}>
                
                <h1 style={{margin: '20px', textAlign: 'center',}}>{title}</h1>
                <hr className='gradient' />
                <br/>
                {helpText !== '' && <InfoModal text={helpText}/>}
                {useGenericBackButton && <GenericBackButton/>}
                <Box sx={{
                    flexGrow: 1,
                    width: '100%',
                    boxSizing: 'border-box',
                }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );  
};

export default LayoutPage;