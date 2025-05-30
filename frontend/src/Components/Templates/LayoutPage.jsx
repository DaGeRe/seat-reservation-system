import SidebarComponent from '../Home/SidebarComponent.jsx';
import { Box } from '@mui/material';
import InfoModal from '../InfoModal.jsx';
import GenericBackButton from '../GenericBackButton.js';
import {LayoutPage_theme} from './LayoutPage.theme.js';

const LayoutPage = ({title, helpText, useGenericBackButton=false, withSidebar=true, children}) => {
    return (
        <Box
            sx={LayoutPage_theme.pageWrapper}
        >
            {withSidebar && <SidebarComponent />}
        
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